import { useEffect, useRef } from 'react';

import {
  BOARD_SIZE,
  MOVE_AREA_SIZE,
  REAL_BOARD_SIZE,
} from '@/common/constants/settings';

const Background = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext('2d');
      if (ctx) {
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
      }
    }
  }, []);

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
