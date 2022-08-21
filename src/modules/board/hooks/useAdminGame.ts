import { useEffect, useRef, useState } from 'react';

import Peer from 'simple-peer';

import { REAL_BOARD_SIZE, TICKRATE } from '@/common/constants/settings';
import { useAdmin } from '@/common/hooks/useAdmin';
import { socket } from '@/common/libs/socket';
import type { Data, DirectionData, UpdateData } from '@/common/types/peer.type';
import { Direction, Player } from '@/common/types/player.type';

import { handlePlayersMovement } from '../helpers/handlePlayersMovement';

export const useAdminGame = (
  {
    peers,
    names,
  }: {
    peers: Map<string, Peer.Instance>;
    names: Map<string, string>;
  },
  direction: Direction,
  playersFromAdmin?: Map<string, Player>
) => {
  const { admin, prevAdminId } = useAdmin();

  const players = useRef<Map<string, Player>>(new Map());
  const [playersState, setPlayersState] = useState<Map<string, Player>>(
    new Map()
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (socket.id === admin.id) {
      interval = setInterval(() => {
        players.current = handlePlayersMovement(players.current);
        setPlayersState(players.current);

        peers.forEach((peer) => {
          if (peer.connected)
            peer.send(
              JSON.stringify({
                type: 'update',
                players: [...players.current],
              } as UpdateData)
            );
        });
      }, 1000 / TICKRATE);
    }

    return () => {
      clearInterval(interval);
    };
  }, [admin.id, players, peers]);

  useEffect(() => {
    if (
      playersFromAdmin &&
      admin.id === socket.id &&
      prevAdminId !== admin.id
    ) {
      playersFromAdmin.delete(prevAdminId);
      players.current = playersFromAdmin;
      setPlayersState(players.current);
    }
  }, [admin.id, playersFromAdmin, prevAdminId]);

  useEffect(() => {
    players.current.set(admin.id, {
      ...players.current.get(admin.id)!,
      direction,
    });
  }, [admin.id, direction]);

  useEffect(() => {
    if (admin.id === socket.id) {
      players.current.set(admin.id, {
        name: admin.name || 'Player 1',
        position: {
          x: 200,
          y: REAL_BOARD_SIZE.height / 2,
        },
        velocityVector: {
          x: 0,
          y: 0,
        },
        team: 'blue',
        direction: { x: 0, y: 0 },
      });
    }
  }, [admin.id, admin.name]);

  useEffect(() => {
    if (socket.id === admin.id) {
      peers.forEach((peer, id) => {
        peer.on('connect', () => {
          players.current.set(id, {
            name: names.get(id) || `Player ${players.current.size + 1}`,
            position: {
              x: REAL_BOARD_SIZE.width - 200,
              y: REAL_BOARD_SIZE.height / 2,
            },
            velocityVector: {
              x: 0,
              y: 0,
            },
            team: 'red',
            direction: { x: 0, y: 0 },
          });
        });

        peer.on('data', (data: string) => {
          const parsedData = JSON.parse(data) as Data;

          if (parsedData.type === 'direction') {
            const newDirection = (parsedData as DirectionData).direction;

            players.current.set(id, {
              ...players.current.get(id)!,
              direction: newDirection,
            });
          } else if (parsedData.type === 'shoot') {
            // TODO: handle shoot
          }
        });
      });
    }

    return () => {
      peers.forEach((peer) => {
        peer.removeAllListeners('connect');
        peer.removeAllListeners('data');
      });
    };
  }, [admin.id, names, peers]);

  useEffect(() => {
    const handlePlayerRemove = (id: string) => players.current.delete(id);
    socket.on('player_left', handlePlayerRemove);

    return () => {
      socket.off('player_left', handlePlayerRemove);
    };
  }, []);

  return playersState;
};
