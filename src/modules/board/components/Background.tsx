import { useEffect, useRef } from 'react';

import { BOARD_SIZE } from '@/common/constants/settings';

const Background = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current.getContext('2d');
      if (ctx) {
        let darker = false;
        for (let i = 0; i < BOARD_SIZE.width; i += 100) {
          if (darker) ctx.fillStyle = '#54925A';
          else ctx.fillStyle = '#5A9D61';

          ctx.fillRect(i, 0, 100, BOARD_SIZE.height);

          darker = !darker;
        }

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(
          BOARD_SIZE.width / 2,
          BOARD_SIZE.height / 2,
          125,
          0,
          Math.PI * 2
        );
        ctx.stroke();

        ctx.moveTo(BOARD_SIZE.width / 2, 0);
        ctx.lineTo(BOARD_SIZE.width / 2, BOARD_SIZE.height);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }, []);

  return (
    <canvas
      ref={ref}
      width={BOARD_SIZE.width}
      height={BOARD_SIZE.height}
      className="absolute overflow-hidden rounded-lg"
    />
  );
};

export default Background;
