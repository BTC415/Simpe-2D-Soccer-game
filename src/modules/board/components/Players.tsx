import { useEffect, useRef, useState } from 'react';

import { BOARD_SIZE, PLAYER_SIZE } from '@/common/constants/settings';

const Players = () => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [direction, setDirection] = useState<{ x: -1 | 0 | 1; y: -1 | 0 | 1 }>({
    x: 0,
    y: 0,
  });

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      switch (e.key) {
        case 'w':
          setDirection((prev) => ({ ...prev, y: -1 }));
          break;
        case 's':
          setDirection((prev) => ({ ...prev, y: 1 }));
          break;
        case 'a':
          setDirection((prev) => ({ ...prev, x: -1 }));
          break;
        case 'd':
          setDirection((prev) => ({ ...prev, x: 1 }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'w':
          if (direction.y === -1) setDirection((prev) => ({ ...prev, y: 0 }));
          break;
        case 's':
          if (direction.y === 1) setDirection((prev) => ({ ...prev, y: 0 }));
          break;
        case 'a':
          if (direction.x === -1) setDirection((prev) => ({ ...prev, x: 0 }));
          break;
        case 'd':
          if (direction.x === 1) setDirection((prev) => ({ ...prev, x: 0 }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const { x, y } = position;

      const newX = x + direction.x * 2;
      const newY = y + direction.y * 2;

      setPosition((prev) => ({
        ...prev,

        x: Math.max(
          Math.min(newX, BOARD_SIZE.width - PLAYER_SIZE),
          PLAYER_SIZE
        ),

        y: Math.max(
          Math.min(newY, BOARD_SIZE.height - PLAYER_SIZE),
          PLAYER_SIZE
        ),
      }));
    }, 15.625);

    return () => clearInterval(interval);
  }, [direction, position]);

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, BOARD_SIZE.width, BOARD_SIZE.height);
        ctx.fillStyle = '#3b82f6';
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.arc(position.x, position.y, PLAYER_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  }, [position.x, position.y]);

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
