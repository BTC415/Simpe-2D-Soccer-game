import { useContext, useRef } from 'react';

import { PLAYER_SIZE, REAL_BOARD_SIZE } from '../constants/settings';
import { gameContext } from '../context/gameContext';
import { Player, PlayerTeam } from '../types/player.type';

export const useGame = () => {
  const { game, setGame, setStatus, status, prevGame } =
    useContext(gameContext);

  const addedScore = useRef(false);

  const setAdmin = (newAdmin: { id: string; name?: string }) => {
    setGame((prev) => ({
      ...prev,
      admin: { id: newAdmin.id, name: newAdmin.name || prev.admin.name },
    }));
  };

  const setPlayerTeam = (playerId: string, team: PlayerTeam) => {
    setGame((prev) => {
      const player = prev.players.get(playerId);
      if (!player) return prev;

      const newPlayers = new Map(prev.players);
      const position = { x: 0, y: REAL_BOARD_SIZE.height / 2 };

      if (team === PlayerTeam.BLUE) {
        position.x = PLAYER_SIZE + 10;
      } else if (team === PlayerTeam.RED) {
        position.x = REAL_BOARD_SIZE.width - PLAYER_SIZE - 10;
      } else if (team === PlayerTeam.SPECTATOR) {
        position.x = -100;
      }

      newPlayers.set(playerId, { ...player, team, position });

      return { ...prev, players: newPlayers };
    });
  };

  const removePlayer = (playerId: string) => {
    setGame((prev) => {
      prev.players.delete(playerId);

      return prev;
    });
  };

  const stopGame = () => {
    setGame((prev) => {
      const newPlayers: Map<string, Player> = new Map();

      prev.players.forEach((player, id) => {
        newPlayers.set(id, {
          ...player,
          team: PlayerTeam.SPECTATOR,
          position: { x: -100, y: REAL_BOARD_SIZE.height / 2 },
        });
      });

      return {
        ...prev,
        players: newPlayers,
        secondsLeft: 300,
        scores: [0, 0],
        started: false,
      };
    });
  };

  const startGame = (seconds: number) => {
    setGame((prev) => ({ ...prev, secondsLeft: seconds, started: true }));
  };

  const addScore = (team: PlayerTeam) => {
    if (!addedScore.current) {
      addedScore.current = true;
      setGame((prev) => {
        let blueScore = prev.scores[0];
        let redScore = prev.scores[1];

        if (team === PlayerTeam.BLUE) blueScore += 1;
        else if (team === PlayerTeam.RED) redScore += 1;

        return { ...prev, scores: [blueScore, redScore] };
      });

      setTimeout(() => {
        addedScore.current = false;
        setGame((prev) => ({
          ...prev,
          ball: {
            velocityVector: { x: 0, y: 0 },
            position: {
              x: REAL_BOARD_SIZE.width / 2,
              y: REAL_BOARD_SIZE.height / 2,
            },
          },
        }));
      }, 3000);
    }
  };

  return {
    game,
    prevGame,
    setGame,
    setAdmin,
    status,
    setStatus,
    setPlayerTeam,
    removePlayer,
    stopGame,
    startGame,
    addScore,
  };
};
