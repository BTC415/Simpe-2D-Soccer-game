import { useEffect, useState } from 'react';

import Peer from 'simple-peer';

import { useAdmin } from '@/common/hooks/useAdmin';
import { socket } from '@/common/libs/socket';

export const usePeers = () => {
  const { admin, setAdmin } = useAdmin();

  const [peers, setPeers] = useState<Map<string, Peer.Instance>>(new Map());
  const [names, setNames] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    socket.on('player_joined', ({ name, id }) => {
      const peer = new Peer({
        initiator: false,
        objectMode: true,
      });

      if (!peers.has(id)) setPeers((prev) => new Map(prev).set(id, peer));
      if (!names.has(id)) setNames((prev) => new Map(prev).set(id, name));
    });

    const handlePeerRemove = (id: string) => {
      setPeers((prev) => {
        const newPeers = new Map(prev);

        newPeers.get(id)?.destroy();
        newPeers.delete(id);

        return newPeers;
      });
    };
    socket.on('player_left', handlePeerRemove);

    socket.on('player_signal', (signal, id) => {
      const peer = peers.get(id);
      if (peer) peer.signal(signal);
    });

    socket.on('admin_change', (newAdminId) => {
      setPeers((prev) => {
        const newPeers = new Map(prev);

        newPeers.get(admin.id)?.destroy();
        newPeers.delete(admin.id);

        return newPeers;
      });
      setAdmin((prev) => ({ ...prev, id: newAdminId }));
    });

    return () => {
      socket.off('player_joined');
      socket.off('player_left', handlePeerRemove);
      socket.off('player_signal');
      socket.off('admin_change');
    };
  }, [admin.id, names, peers, setAdmin]);

  useEffect(() => {
    if (admin.id && admin.id !== socket.id && !peers.has(admin.id)) {
      const peer = new Peer({
        initiator: true,
        objectMode: true,
      });

      setPeers((prev) => new Map(prev).set(admin.id, peer));
    }
  }, [admin.id, peers]);

  useEffect(() => {
    peers.forEach((peer, id) => {
      peer.on('signal', (signal) => {
        socket.emit('signal_received', signal, id);
      });
    });

    return () => {
      peers.forEach((peer) => {
        peer.removeAllListeners('signal');
      });
    };
  }, [peers]);

  return { peers, names };
};
