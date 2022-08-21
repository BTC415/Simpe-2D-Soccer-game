import { useEffect, useRef, useState } from 'react';

import Peer from 'simple-peer';

import { REAL_BOARD_SIZE, TICKRATE } from '@/common/constants/settings';
import { useAdmin } from '@/common/hooks/useAdmin';
import { decoder } from '@/common/libs/decoder';
import { socket } from '@/common/libs/socket';
import {
  Data,
  DataType,
  DirectionData,
  PositionData,
} from '@/common/types/peer.type';
import { Direction, Player } from '@/common/types/player.type';

import { handlePlayersMovement } from '../helpers/handlePlayersMovement';

const makeEasyPositions = (players: Map<string, Player>) => {
  const easyPositions: { [key: string]: [number, number] } = {};

  players.forEach(({ position }, id) => {
    easyPositions[id] = [position.x, position.y];
  });

  return easyPositions;
};

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
): [
  {
    [key: string]: [number, number];
  },
  Map<string, Player>
] => {
  const { admin, prevAdminId } = useAdmin();

  const players = useRef<Map<string, Player>>(new Map());
  const [playersState, setPlayersState] = useState<Map<string, Player>>(
    new Map()
  );

  useEffect(() => {
    let gameplay: NodeJS.Timeout;
    let updateGame: NodeJS.Timeout;

    if (socket.id === admin.id) {
      gameplay = setInterval(() => {
        players.current = handlePlayersMovement(players.current);
        setPlayersState(players.current);

        peers.forEach((peer) => {
          if (peer.connected)
            peer.send(
              JSON.stringify({
                type: DataType.POSITIONS,
                positions: makeEasyPositions(players.current),
              } as PositionData)
            );
        });
      }, 1000 / TICKRATE);

      updateGame = setInterval(() => {
        peers.forEach((peer) => {
          if (peer.connected)
            peer.send(
              JSON.stringify({
                type: DataType.GAME,
                players: [...players.current],
              } as Data)
            );
        });
      }, 1000);
    }

    return () => {
      clearInterval(gameplay);
      clearInterval(updateGame);
    };
  }, [admin.id, players, peers]);

  useEffect(() => {
    if (
      playersFromAdmin?.size &&
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

        peer.on('data', (data: Uint8Array) => {
          const parsedData = JSON.parse(decoder.decode(data)) as Data;

          if (parsedData.type === DataType.DIRECTION) {
            const newDirection = (parsedData as DirectionData).direction;

            players.current.set(id, {
              ...players.current.get(id)!,
              direction: newDirection,
            });
          } else if (parsedData.type === DataType.SHOOT) {
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

  return [makeEasyPositions(playersState), playersState];
};
