import { useEffect, useRef } from 'react';

import { BOARD_SIZE, PLAYER_SIZE } from '@/common/constants/settings';
import { useAnimationFrame } from '@/common/hooks/useAnimationFrame';
import { socket } from '@/common/libs/socket';
import type { GameClient } from '@/common/types/game.type';
import { TICKRATE } from '@/server/constants/settings';

import { useKeysDirection } from '../hooks/useKeysDirection';

const Players = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  const game = useRef<GameClient>();
  const prevGame = useRef<GameClient>();

  useKeysDirection();

  useAnimationFrame((fps) => {
    if (!prevGame.current || !game.current) return;

    // SMOOTHER MOVEMENT ON HIGH FPS
    const ratio = fps / TICKRATE;
    prevGame.current.players = prevGame.current.players.map((player, index) => {
      const { position } = player;
      const newPosition = game.current?.players[index].position;
      if (!newPosition) return player;

      const difX = newPosition.x - position.x;
      const difY = newPosition.y - position.y;

      const newX = position.x + difX / ratio;
      const newY = position.y + difY / ratio;

      return {
        ...player,
        position: {
          x: newX,
          y: newY,
        },
      };
    });

    if (ref.current) {
      const ctx = ref.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, BOARD_SIZE.width, BOARD_SIZE.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';

        prevGame.current.players.forEach(({ position: { x, y }, team }) => {
          ctx.fillStyle = team === 'blue' ? '#3b82f6' : '#ef4444';

          ctx.beginPath();
          ctx.arc(x, y, PLAYER_SIZE, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.closePath();
        });

        ctx.font = `bold ${PLAYER_SIZE / 1.9}px Montserrat`;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';

        ctx.fillText(`${fps}fps`, BOARD_SIZE.width - 40, 25);

        prevGame.current.players.forEach(({ position: { x, y }, name }) => {
          ctx.fillText(name, x, y + PLAYER_SIZE + 20);
        });
      }
    }
  });

  useEffect(() => {
    socket.on('update', (newGame) => {
      if (game.current) prevGame.current = game.current;

      game.current = newGame;
    });

    return () => {
      socket.off('update');
    };
  }, []);

  return (
    <canvas
      ref={ref}
      width={BOARD_SIZE.width}
      height={BOARD_SIZE.height}
      className="absolute z-10"
    />
  );
};

export default Players;
