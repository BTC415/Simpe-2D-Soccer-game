import { useEffect, useState } from 'react';

const Loader = () => {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev + 1 > 3) return 0;
        return prev + 1;
      });
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <p>Connecting to host{'.'.repeat(dots)}</p>;
};

export default Loader;
