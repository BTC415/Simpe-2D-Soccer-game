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
        const nonVisibleArea =
          (REAL_BOARD_SIZE.width - windowWidth) / 2 - Math.abs(camX);

        if (
          (camX > 0 &&
            windowWidth + nonVisibleArea < ballPosition[0] - BALL_SIZE) ||
          (camX < 0 &&
            REAL_BOARD_SIZE.width - windowWidth - nonVisibleArea >
              ballPosition[0] + BALL_SIZE)
        )
          inViewportX = false;
      }

      if (movableY) {
        const nonVisibleArea = -camY;

        if (
          (position.y < ballPosition[1] &&
            windowHeight + nonVisibleArea < ballPosition[1] - BALL_SIZE) ||
          (position.y > ballPosition[1] &&
            nonVisibleArea > ballPosition[1] + BALL_SIZE)
        )
          inViewportY = false;
      }

      const inViewport = inViewportX && inViewportY;

      if (!inViewport) {
        const distanceX = ballPosition[0] - position.x;
        const distanceY = ballPosition[1] - position.y;
        const length = Math.sqrt(distanceX ** 2 + distanceY ** 2) || 1;
        const unit = { x: distanceX / length, y: distanceY / length };

        ctx.fillStyle = '#fff';
        const x = position.x + unit.x * 75;
        const y = position.y + unit.y * 75;

        const p = new Path2D(
          'M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z'
        );

        const rotate =
          Math.atan2(ballPosition[1] - y, ballPosition[0] - x) + 0.785398;

        ctx.translate(x, y);
        ctx.rotate(rotate);
        ctx.fill(p);
        ctx.stroke(p);
      }
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

export default BallTracker;
