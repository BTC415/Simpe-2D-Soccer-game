import { useEffect, useRef, useState } from 'react';

import { BOARD_SIZE, MOVE, PLAYER_SIZE } from '@/common/constants/settings';

import { makePosition } from '../helpers/makePosition';
import { useKeysDirection } from '../hooks/useKeysDirection';

const velocityVector = { x: 0, y: 0 };

const Players = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  const [player1, setPlayer1] = useState({
    x: 200,
    y: 200,
  });
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const direction = useKeysDirection();

  useEffect(() => {
    const interval = setInterval(() => {
      if (direction.x === 1) {
        velocityVector.x = Math.min(
          velocityVector.x + MOVE.ACCELERATION,
          MOVE.MAX_SPEED
        );
      } else if (direction.x === -1) {
        velocityVector.x = Math.max(
          velocityVector.x - MOVE.ACCELERATION,
          -MOVE.MAX_SPEED
        );
      } else if (velocityVector.x > 0) {
        velocityVector.x = Math.max(velocityVector.x - MOVE.DECELERATION, 0);
      } else if (velocityVector.x < 0) {
        velocityVector.x = Math.min(velocityVector.x + MOVE.DECELERATION, 0);
      }

      if (direction.y === 1) {
        velocityVector.y = Math.min(
          velocityVector.y + MOVE.ACCELERATION,
          MOVE.MAX_SPEED
        );
      } else if (direction.y === -1) {
        velocityVector.y = Math.max(
          velocityVector.y - MOVE.ACCELERATION,
          -MOVE.MAX_SPEED
        );
      } else if (velocityVector.y > 0) {
        velocityVector.y = Math.max(velocityVector.y - MOVE.DECELERATION, 0);
      } else if (velocityVector.y < 0) {
        velocityVector.y = Math.min(velocityVector.y + MOVE.DECELERATION, 0);
      }

      const newPosition = makePosition(
        position.x + velocityVector.x,
        position.y + velocityVector.y
      );

      const distanceX = newPosition.x - player1.x;
      const distanceY = newPosition.y - player1.y;
      const length = Math.sqrt(distanceX ** 2 + distanceY ** 2) || 1;

      if (length < 61) {
        const unitX = distanceX / length;
        const unitY = distanceY / length;

        const collisionPosition = makePosition(
          player1.x + 61 * unitX,
          player1.y + 61 * unitY
        );

        const newPlayer1 = makePosition(player1.x - unitX, player1.y - unitY);

        setPosition(collisionPosition);
        setPlayer1(newPlayer1);
      } else {
        setPosition(newPosition);
      }
    }, 15.625);

    return () => clearInterval(interval);
  }, [direction, position, player1]);

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.clearRect(0, 0, BOARD_SIZE.width, BOARD_SIZE.height);
        ctx.fillStyle = '#3b82f6';
        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.arc(position.x, position.y, PLAYER_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(player1.x, player1.y, PLAYER_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }
  }, [position.x, position.y, player1]);

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
