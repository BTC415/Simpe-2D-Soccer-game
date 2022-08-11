import { useEffect, useRef } from 'react';

export const useAnimationFrame = (callback: (fps: number) => void) => {
  const times = useRef<number[]>([]);
  const fps = useRef(9);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const now = performance.now();
        while (times.current.length > 0 && times.current[0] <= now - 1000) {
          times.current.shift();
        }
        times.current.push(now);
        fps.current = times.current.length;

        callback(fps.current);
      }

      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current || -1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
