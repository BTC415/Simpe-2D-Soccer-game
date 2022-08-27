import { useEffect, useRef } from 'react';

import {
  BOARD_SIZE,
  GOAL_POSITION,
  MOVE_AREA_SIZE,
  REAL_BOARD_SIZE,
} from '@/common/constants/settings';

import { useCamera } from '../hooks/useCamera';

const Background = () => {
  const { camX, camY } = useCamera();

  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, REAL_BOARD_SIZE.width, REAL_BOARD_SIZE.height);

        ctx.translate(camX, camY);

        ctx.fillStyle = '#5A9D61';
        ctx.fillRect(0, 0, REAL_BOARD_SIZE.width, REAL_BOARD_SIZE.height);

        let darker = false;

        let lineWidth = 100;
        const howManyLines = BOARD_SIZE.width / lineWidth;
        if (howManyLines % 2 === 0)
          lineWidth = Math.ceil(BOARD_SIZE.width / (howManyLines + 1));

        for (let i = 0; i < BOARD_SIZE.width; i += lineWidth) {
          if (darker) ctx.fillStyle = '#54925A';
          else ctx.fillStyle = '#5A9D61';

          ctx.fillRect(
            i + MOVE_AREA_SIZE,
            MOVE_AREA_SIZE,
            lineWidth,
            BOARD_SIZE.height
          );

          darker = !darker;
        }

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(
          BOARD_SIZE.width / 2 + MOVE_AREA_SIZE,
          BOARD_SIZE.height / 2 + MOVE_AREA_SIZE,
          125,
          0,
          Math.PI * 2
        );
        ctx.stroke();

        ctx.moveTo(BOARD_SIZE.width / 2 + MOVE_AREA_SIZE, MOVE_AREA_SIZE);
        ctx.lineTo(
          BOARD_SIZE.width / 2 + MOVE_AREA_SIZE,
          BOARD_SIZE.height + MOVE_AREA_SIZE
        );
        ctx.stroke();
        ctx.closePath();

        ctx.strokeRect(
          MOVE_AREA_SIZE,
          MOVE_AREA_SIZE,
          BOARD_SIZE.width,
          BOARD_SIZE.height
        );

        // GOALS
        ctx.beginPath();

        // LEFT GOAL
        ctx.moveTo(GOAL_POSITION.fromLeft, REAL_BOARD_SIZE.height / 2);
        ctx.lineTo(
          GOAL_POSITION.fromLeft,
          REAL_BOARD_SIZE.height / 2 - GOAL_POSITION.height
        );
        ctx.lineTo(
          GOAL_POSITION.fromLeft + MOVE_AREA_SIZE,
          REAL_BOARD_SIZE.height / 2 - GOAL_POSITION.height
        );

        ctx.moveTo(GOAL_POSITION.fromLeft, REAL_BOARD_SIZE.height / 2);
        ctx.lineTo(
          GOAL_POSITION.fromLeft,
          REAL_BOARD_SIZE.height / 2 + GOAL_POSITION.height
        );
        ctx.lineTo(
          GOAL_POSITION.fromLeft + MOVE_AREA_SIZE,
          REAL_BOARD_SIZE.height / 2 + GOAL_POSITION.height
        );

        // RIGHT GOAL
        ctx.moveTo(
          REAL_BOARD_SIZE.width - GOAL_POSITION.fromLeft,
          REAL_BOARD_SIZE.height / 2
        );
        ctx.lineTo(
          REAL_BOARD_SIZE.width - GOAL_POSITION.fromLeft,
          REAL_BOARD_SIZE.height / 2 - GOAL_POSITION.height
        );
        ctx.lineTo(
          REAL_BOARD_SIZE.width - GOAL_POSITION.fromLeft - MOVE_AREA_SIZE,
          REAL_BOARD_SIZE.height / 2 - GOAL_POSITION.height
        );

        ctx.moveTo(
          REAL_BOARD_SIZE.width - GOAL_POSITION.fromLeft,
          REAL_BOARD_SIZE.height / 2
        );
        ctx.lineTo(
          REAL_BOARD_SIZE.width - GOAL_POSITION.fromLeft,
          REAL_BOARD_SIZE.height / 2 + GOAL_POSITION.height
        );
        ctx.lineTo(
          REAL_BOARD_SIZE.width - GOAL_POSITION.fromLeft - MOVE_AREA_SIZE,
          REAL_BOARD_SIZE.height / 2 + GOAL_POSITION.height
        );

        ctx.stroke();
        ctx.closePath();

        // REMOVE WHITE LINES
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#5A9D61';

        ctx.moveTo(
          MOVE_AREA_SIZE,
          REAL_BOARD_SIZE.height / 2 - GOAL_POSITION.height + 2
        );
        ctx.lineTo(
          MOVE_AREA_SIZE,
          REAL_BOARD_SIZE.height / 2 + GOAL_POSITION.height - 2
        );

        ctx.moveTo(
          REAL_BOARD_SIZE.width - MOVE_AREA_SIZE,
          REAL_BOARD_SIZE.height / 2 - GOAL_POSITION.height + 2
        );
        ctx.lineTo(
          REAL_BOARD_SIZE.width - MOVE_AREA_SIZE,
          REAL_BOARD_SIZE.height / 2 + GOAL_POSITION.height - 2
        );

        ctx.stroke();

        ctx.closePath();
      }
    }
  }, [camX, camY]);

  return (
    <canvas
      ref={ref}
      width={REAL_BOARD_SIZE.width}
      height={REAL_BOARD_SIZE.height}
      className="absolute overflow-hidden rounded-lg"
    />
  );
};

export default Background;
