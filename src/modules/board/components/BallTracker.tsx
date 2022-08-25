import { useRef } from 'react';

import {
  BALL_SIZE,
  PLAYER_SIZE,
  REAL_BOARD_SIZE,
} from '@/common/constants/settings';

import { useCamera } from '../hooks/useCamera';

const BallTracker = ({ ballPosition }: { ballPosition: [number, number] }) => {
  const {
    camX,
    camY,
    position,
    windowWidth,
    windowHeight,
    movableX,
    movableY,
  } = useCamera();

  const ref = useRef<HTMLCanvasElement>(null);

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

      let inViewportX = true;
      let inViewportY = true;

      if (movableX) {
        if (ballPosition[0] > position.x)
          inViewportX =
            position.x + windowWidth / 2 + BALL_SIZE > ballPosition[0];
        else
          inViewportX =
            position.x - windowWidth / 2 - BALL_SIZE < ballPosition[0];
      }

      if (movableY) {
        if (ballPosition[1] > position.y)
          inViewportY =
            position.y + windowHeight / 2 + BALL_SIZE > ballPosition[1];
        else
          inViewportY =
            position.y - windowHeight / 2 - BALL_SIZE < ballPosition[1];
      }

      const inViewport = inViewportX && inViewportY;

      if (!inViewport) {
        const distanceX = ballPosition[0] - position.x;
        const distanceY = ballPosition[1] - position.y;
        const length = Math.sqrt(distanceX ** 2 + distanceY ** 2) || 1;
        const unit = { x: distanceX / length, y: distanceY / length };

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(
          position.x + unit.x * 60,
          position.y + unit.y * 60,
          5,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  return (
    <canvas
      ref={ref}
      width={REAL_BOARD_SIZE.width}
      height={REAL_BOARD_SIZE.height}
      className="absolute z-20"
    />
  );
};

export default BallTracker;
