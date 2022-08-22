import { useEffect, useState } from 'react';

import Peer from 'simple-peer';

import { DEFAULT_GAME } from '@/common/context/gameContext';
import { useGame } from '@/common/hooks/useGame';
import { socket } from '@/common/libs/socket';
import { StatusPeer } from '@/common/types/game.type';
import { Loader, Error } from '@/modules/loader';
import { useModal } from '@/modules/modal';

export const usePeers = () => {
  const { game, setAdmin, setGame, setStatus, status } = useGame();
  const { admin } = game;
  const { openModal, closeModal } = useModal();

  const [peers, setPeers] = useState<Map<string, Peer.Instance>>(new Map());
  const [names, setNames] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    socket.on('player_joined', ({ name, id }) => {
      const peer = new Peer({
        initiator: false,
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
      if (newAdminId === socket.id)
        game.players.forEach(({ name }, id) => {
          const peer = new Peer({
            initiator: false,
          });

          setPeers((prev) => new Map(prev).set(id, peer));
          setNames((prev) => new Map(prev).set(id, name));
        });
      else setGame(DEFAULT_GAME);
      setPeers((prev) => {
        const newPeers = new Map(prev);

        newPeers.get(admin.id)?.destroy();
        newPeers.delete(admin.id);

        return newPeers;
      });
      setAdmin({ id: newAdminId });
    });

    return () => {
      socket.off('player_joined');
      socket.off('player_left', handlePeerRemove);
      socket.off('player_signal');
      socket.off('admin_change');
    };
  }, [admin.id, game.players, names, peers, setAdmin, setGame]);

  useEffect(() => {
    if (admin.id && admin.id !== socket.id && !peers.has(admin.id)) {
      const peer = new Peer({
        initiator: true,
      });

      peer.on('error', () => setStatus(StatusPeer.ERROR));

      setPeers((prev) => new Map(prev).set(admin.id, peer));
      setStatus(StatusPeer.CONNECTING);

      return () => {
        peer.removeAllListeners('error');
      };
    }

    return () => {};
  }, [admin.id, peers, setStatus]);

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

  useEffect(() => {
    const me = game.players.has(socket.id);

    if (me && socket.id !== game.admin.id) setStatus(StatusPeer.CONNECTED);
  }, [game, setStatus]);

  useEffect(() => {
    if (status === StatusPeer.CONNECTING) openModal(<Loader />, false);
    else if (status === StatusPeer.ERROR) openModal(<Error />, false);
    else if (status === StatusPeer.CONNECTED) closeModal();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { peers, names };
};
