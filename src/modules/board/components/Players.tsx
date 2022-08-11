import { useEffect, useRef, useState } from 'react';

import { PLAYER_SIZE, REAL_BOARD_SIZE } from '@/common/constants/settings';
import { socket } from '@/common/libs/socket';
import type { GameClient } from '@/common/types/game.type';

import { useCamera } from '../hooks/useCamera';
import { useKeysDirection } from '../hooks/useKeysDirection';

const Players = () => {
  const { setPosition, camX, camY } = useCamera();

  const ref = useRef<HTMLCanvasElement>(null);

  const [game, setGame] = useState<GameClient>();

  useKeysDirection();

  useEffect(() => {
    socket.on('update', (newGame) => {
      setGame(newGame);
      newGame.players.forEach(
        ({ position, id }) => id === socket.id && setPosition(position)
      );
    });

    return () => {
      socket.off('update');
    };
  }, [setPosition]);

  if (ref.current) {
    const ctx = ref.current.getContext('2d');
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(
        0,
        0,
        REAL_BOARD_SIZE.width + PLAYER_SIZE * 2,
        REAL_BOARD_SIZE.height + PLAYER_SIZE
      );

      ctx.translate(camX, camY);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';

      game?.players.forEach(({ position: { x, y }, team }) => {
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
      game?.players.forEach(({ position: { x, y }, name }) => {
        ctx.fillText(name, x, y + PLAYER_SIZE + 20);
      });
    }
  }

  return (
    <canvas
      ref={ref}
      width={REAL_BOARD_SIZE.width}
      height={REAL_BOARD_SIZE.height}
      className="absolute z-10"
    />
  );
};

export default Players;
