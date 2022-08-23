import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { REAL_BOARD_SIZE, TICKRATE } from '@/common/constants/settings';
import { useGame } from '@/common/hooks/useGame';
import { usePeers } from '@/common/hooks/usePeers';
import { decoder } from '@/common/libs/decoder';
import { socket } from '@/common/libs/socket';
import {
  Data,
  DataType,
  DirectionData,
  GameData,
  PositionData,
  TeamChangeData,
} from '@/common/types/peer.type';
import { Direction, Player, PlayerTeam } from '@/common/types/player.type';

import { handlePlayersMovement } from '../helpers/handlePlayersMovement';

const makeEasyPositions = (players: Map<string, Player>) => {
  const easyPositions: { [key: string]: [number, number] } = {};

  players.forEach(({ position }, id) => {
    easyPositions[id] = [position.x, position.y];
  });

  return easyPositions;
};

export const useAdminGame = (
  names: Map<string, string>,
  direction: Direction
): [
  {
    [key: string]: [number, number];
  },
  Map<string, Player>
] => {
  const { game, prevGame, setGame, removePlayer, setPlayerTeam } = useGame();
  const { admin } = game;
  const { peers } = usePeers();

  const players = useRef<Map<string, Player>>(new Map());
  const [playersState, setPlayersState] = useState<Map<string, Player>>(
    new Map()
  );

  const { gameId } = useRouter().query;

  useEffect(() => {
    let gameplay: NodeJS.Timeout;

    if (socket.id === admin.id) {
      gameplay = setInterval(() => {
        if (!game.paused && game.started) {
          players.current = handlePlayersMovement(players.current);
          setPlayersState(players.current);
        }

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
    }

    return () => {
      clearInterval(gameplay);
    };
  }, [admin.id, game, gameId, peers, setGame]);

  useEffect(() => {
    let updateGame: NodeJS.Timeout;
    if (socket.id === admin.id)
      updateGame = setInterval(() => {
        setGame((prev) => ({
          ...prev,
          players: players.current,
          id: gameId?.toString() || '',
          secondsLeft: prev.secondsLeft - 1,
        }));
      }, 1000);

    return () => {
      clearInterval(updateGame);
    };
  }, [admin.id, gameId, setGame]);

  useEffect(() => {
    if (
      game.players.size &&
      admin.id === socket.id &&
      prevGame.admin.id !== admin.id
    ) {
      game.players.delete(prevGame.admin.id);
      players.current = game.players;
      setPlayersState(players.current);
      setGame(game);
    }
  }, [admin.id, game, prevGame.admin.id, setGame]);

  useEffect(() => {
    players.current = game.players;
    setPlayersState(game.players);

    peers.forEach((peer) => {
      if (peer.connected)
        peer.send(
          JSON.stringify({
            type: DataType.GAME,
            game: {
              ...game,
              players: [...players.current],
            },
          } as any as GameData)
        );
    });
  }, [game, peers]);

  useEffect(() => {
    if (players.current.has(admin.id))
      players.current.set(admin.id, {
        ...players.current.get(admin.id)!,
        direction,
      });
  }, [admin.id, direction]);

  useEffect(() => {
    if (admin.id === socket.id && !players.current.has(admin.id))
      players.current.set(admin.id, {
        index: 1,
        name: admin.name || 'Player 1',
        position: {
          x: 200,
          y: REAL_BOARD_SIZE.height / 2,
        },
        velocityVector: {
          x: 0,
          y: 0,
        },
        team: PlayerTeam.BLUE,
        direction: { x: 0, y: 0 },
      });
  }, [admin.id, admin.name]);

  useEffect(() => {
    if (socket.id === admin.id) {
      peers.forEach((peer, id) => {
        peer.on('connect', () => {
          if (!players.current.has(id)) {
            let newIndex = 0;
            do {
              newIndex += 1;
            } while (
              [...players.current.values()].some(
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                (player) => player.index === newIndex
              )
            );

            players.current.set(id, {
              index: newIndex,
              name: names.get(id) || `Player ${newIndex}`,
              position: {
                x: REAL_BOARD_SIZE.width - 200,
                y: REAL_BOARD_SIZE.height / 2,
              },
              velocityVector: {
                x: 0,
                y: 0,
              },
              team: PlayerTeam.RED,
              direction: { x: 0, y: 0 },
            });
          }
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
          } else if (parsedData.type === DataType.TEAM_CHANGE)
            setPlayerTeam(id, (parsedData as TeamChangeData).team);
        });
      });
    }

    return () => {
      peers.forEach((peer) => {
        peer.removeAllListeners('connect');
        peer.removeAllListeners('data');
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin.id, names, peers]);

  useEffect(() => {
    const handlePlayerRemove = (id: string) => removePlayer(id);
    socket.on('player_left', handlePlayerRemove);

    return () => {
      socket.off('player_left', handlePlayerRemove);
    };
  }, [removePlayer]);

  return [makeEasyPositions(playersState), playersState];
};
