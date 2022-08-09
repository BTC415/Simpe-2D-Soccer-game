import { useEffect, useRef, useState } from 'react';

import { BOARD_SIZE, PLAYER_SIZE } from '@/common/constants/settings';
import { socket } from '@/common/libs/socket';
import type { GameClient } from '@/common/types/game.type';

import { useKeysDirection } from '../hooks/useKeysDirection';

const Players = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  const [game, setGame] = useState<GameClient>();

  useKeysDirection();

  useEffect(() => {
    socket.on('update', (newGame) => setGame(newGame));

    return () => {
      socket.off('update');
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, BOARD_SIZE.width, BOARD_SIZE.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.font = `bold ${PLAYER_SIZE / 1.9}px Montserrat`;

        game?.players.forEach(({ position: { x, y } }) => {
          ctx.fillStyle = '#3b82f6';

          ctx.beginPath();
          ctx.arc(x, y, PLAYER_SIZE, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // ctx.fillStyle = '#fff';
          // ctx.fillText(player.name, x - PLAYER_SIZE, y + PLAYER_SIZE + 20);

          ctx.closePath();
        });
      }
    }
  }, [game?.players]);

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
