import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { REAL_BOARD_SIZE, TICKRATE } from '@/common/constants/settings';
import { useGame } from '@/common/hooks/useGame';
import { usePeers } from '@/common/hooks/usePeers';
import { decoder } from '@/common/libs/decoder';
import { socket } from '@/common/libs/socket';
import { Ball } from '@/common/types/ball.type';
import {
  Data,
  DataType,
  DirectionData,
  GameData,
  PlayerJoinLeftData,
  PositionData,
  TeamChangeData,
} from '@/common/types/peer.type';
import { Direction, Player, PlayerTeam } from '@/common/types/player.type';

import { getName } from '../helpers/getName';
import { handleAllPhysics } from '../helpers/handleAllPhysics';

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
  Map<string, Player>,
  [number, number]
] => {
  const {
    game,
    prevGame,
    setGame,
    removePlayer,
    setPlayerTeam,
    setAdmin,
    stopGame,
  } = useGame();
  const { admin } = game;
  const { peers } = usePeers();

  const players = useRef<Map<string, Player>>(new Map());
  const [playersState, setPlayersState] = useState<Map<string, Player>>(
    new Map()
  );

  const ball = useRef<Ball>({
    position: { x: 300, y: 300 },
    velocityVector: { x: 0, y: 0 },
  });
  const [ballState, setBallState] = useState<Ball>({
    position: { x: 0, y: 0 },
    velocityVector: { x: 0, y: 0 },
  });

  const { gameId } = useRouter().query;

  useEffect(() => {
    let gameplay: NodeJS.Timeout;
    let reverse = false;

    if (socket.id === admin.id) {
      gameplay = setInterval(() => {
        if (!game.paused && game.started) {
          [ball.current, players.current] = handleAllPhysics(
            { ball: ball.current, players: players.current },
            reverse
          );
          setPlayersState(players.current);
          setBallState(ball.current);

          reverse = !reverse;
        }

        peers.forEach((peer) => {
          if (peer.connected)
            peer.send(
              JSON.stringify({
                type: DataType.POSITIONS,
                positions: makeEasyPositions(players.current),
                ballPosition: [
                  ball.current.position.x,
                  ball.current.position.y,
                ],
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
    if (socket.id === admin.id && game.started)
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
  }, [admin.id, gameId, setGame, game.started]);
  useEffect(() => {
    if (game.secondsLeft < 0) stopGame();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.secondsLeft]);

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
    if (admin.id === socket.id && !players.current.has(admin.id)) {
      players.current.set(admin.id, {
        index: 1,
        name: admin.name || 'Player 1',
        position: {
          x: -100,
          y: REAL_BOARD_SIZE.height / 2,
        },
        velocityVector: {
          x: 0,
          y: 0,
        },
        team: PlayerTeam.SPECTATOR,
        direction: { x: 0, y: 0 },
      });
      setAdmin({ id: admin.id, name: admin.name || 'Player 1' });
    }
  }, [admin.id, admin.name, setAdmin]);

  useEffect(() => {
    if (socket.id === admin.id) {
      peers.forEach((peer, id) => {
        peer.once('connect', () => {
          if (!players.current.has(id)) {
            const { name, newIndex } = getName(id, { game, names });

            peers.forEach((peerNested, idNested) => {
              if (idNested === id || !peerNested || !peerNested.connected)
                return;
              peerNested.send(
                JSON.stringify({
                  type: DataType.PLAYER_JOIN_LEFT,
                  join: true,
                  name,
                } as PlayerJoinLeftData)
              );
            });

            players.current.set(id, {
              index: newIndex,
              name,
              position: {
                x: -100,
                y: REAL_BOARD_SIZE.height / 2,
              },
              velocityVector: {
                x: 0,
                y: 0,
              },
              team: PlayerTeam.SPECTATOR,
              direction: { x: 0, y: 0 },
            });

            setPlayersState(players.current);
            setGame((prev) => ({ ...prev, players: players.current }));
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
        peer.removeAllListeners('data');
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin.id, names, peers]);

  useEffect(() => {
    const handlePlayerRemove = (id: string) => {
      peers.forEach((peer) => {
        if (!peer || !peer.connected) return;
        peer.send(
          JSON.stringify({
            type: DataType.PLAYER_JOIN_LEFT,
            join: false,
            name: game.players.get(id)?.name || '',
          } as PlayerJoinLeftData)
        );
      });

      toast(`${game.players.get(id)?.name || 'Player'} left the game`, {
        type: 'info',
      });

      removePlayer(id);
    };
    socket.on('player_left', handlePlayerRemove);

    return () => {
      socket.off('player_left', handlePlayerRemove);
    };
  }, [game.players, peers, removePlayer]);

  return [
    makeEasyPositions(playersState),
    playersState,
    [ballState.position.x, ballState.position.y],
  ];
};
