import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import Peer from 'simple-peer';

import { ICE_SERVERS } from '@/common/constants/iceServers';
import { DEFAULT_GAME } from '@/common/context/gameContext';
import { useGame } from '@/common/hooks/useGame';
import { usePeers } from '@/common/hooks/usePeers';
import { socket } from '@/common/libs/socket';
import { StatusPeer } from '@/common/types/game.type';
import { DataType, PlayerJoinLeftData } from '@/common/types/peer.type';
import { Loader, Error } from '@/modules/game/modules/loader';
import Menu from '@/modules/game/modules/menu';
import { useModal } from '@/modules/modal';

import { getName } from '../helpers/getName';

export const usePeersConnect = () => {
  const { peers, setPeers } = usePeers();
  const { game, setAdmin, setGame, setStatus, status } = useGame();
  const { admin } = game;
  const { openModal } = useModal();

  const [names, setNames] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    socket.on('player_joined', ({ name, id }) => {
      const peer = new Peer({
        initiator: false,
        config: {
          iceServers: ICE_SERVERS,
        },
      });

      const promise = new Promise((resolve, reject) => {
        peer.once('connect', () => resolve('resolve'));
        peer.once('error', (err) => {
          // eslint-disable-next-line no-console
          console.log(err);
          reject(err);
        });

        setTimeout(() => {
          reject();
        }, 15000);
      });

      const finalName = getName(id, { game, names }, name).name;

      const toastId = toast.loading(`${finalName} is connecting`);

      promise
        .then(() =>
          toast.update(toastId, {
            render: `${finalName} joined the game`,
            type: 'info',
            isLoading: false,
            autoClose: 5000,
          })
        )
        .catch(() => {
          toast.update(toastId, {
            render: `${finalName} has error in connecting`,
            type: 'error',
            isLoading: false,
            autoClose: 5000,
          });
        });

      if (!peers.has(id)) setPeers((prev) => new Map(prev).set(id, peer));
      if (!names.has(id)) setNames((prev) => new Map(prev).set(id, finalName));
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
      if (newAdminId === socket.id) {
        const oldAdminName = game.players.get(admin.id)?.name;

        toast(`${oldAdminName} left the game`, { type: 'info' });
        toast('You are now host', { type: 'info' });

        game.players.delete(game.admin.id);
        game.players.forEach(({ name }, id) => {
          const peer = new Peer({
            initiator: false,
            config: {
              iceServers: ICE_SERVERS,
            },
          });

          peer.once('connect', () =>
            peer.send(
              JSON.stringify({
                type: DataType.PLAYER_JOIN_LEFT,
                join: false,
                name: oldAdminName || 'Player',
              } as PlayerJoinLeftData)
            )
          );

          setPeers((prev) => new Map(prev).set(id, peer));
          setNames((prev) => new Map(prev).set(id, name));
        });
        setGame(game);
      } else setGame({ ...DEFAULT_GAME, players: new Map() });
      setPeers((prev) => {
        const newPeers = new Map(prev);

        newPeers.get(admin.id)?.destroy();
        newPeers.delete(admin.id);

        return newPeers;
      });
      setAdmin({
        id: newAdminId,
        name: game.players.get(newAdminId)?.name || 'Player',
      });
    });

    return () => {
      socket.off('player_joined');
      socket.off('player_left', handlePeerRemove);
      socket.off('player_signal');
      socket.off('admin_change');
    };
  }, [
    admin.id,
    admin.name,
    game,
    game.players,
    names,
    peers,
    setAdmin,
    setGame,
    setPeers,
  ]);

  useEffect(() => {
    if (admin.id && admin.id !== socket.id && !peers.has(admin.id)) {
      const peer = new Peer({
        initiator: true,
        config: {
          iceServers: ICE_SERVERS,
        },
      });

      peer.once('error', () => setStatus(StatusPeer.ERROR));

      setPeers((prev) => new Map(prev).set(admin.id, peer));
      setStatus(StatusPeer.CONNECTING);
    }

    if (admin.id === socket.id) setStatus(StatusPeer.CONNECTED);
  }, [admin.id, peers, setPeers, setStatus]);

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
    if (game.admin.id === socket.id) {
      setStatus(StatusPeer.CONNECTED);
      return;
    }

    const me = game.players.has(socket.id);

    if (me) setStatus(StatusPeer.CONNECTED);
  }, [game, setStatus]);

  useEffect(() => {
    if (status === StatusPeer.CONNECTING) openModal(<Loader />, false);
    else if (status === StatusPeer.ERROR) openModal(<Error />, false);
    else if (status === StatusPeer.CONNECTED && game.started)
      openModal(<Menu />);
    else if (status === StatusPeer.CONNECTED && !game.started)
      openModal(<Menu />, false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return names;
};
