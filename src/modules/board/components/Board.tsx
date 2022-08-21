import { useEffect, useState } from 'react';

import { REAL_BOARD_SIZE } from '@/common/constants/settings';

import { playerPositionContext } from '../context/playerPosition';
import Background from './Background';
import Players from './Players';

const Board = () => {
  const [smallScreen, setSmallScreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleSetPosition = ({ x, y }: { x: number; y: number }) => {
    setPosition({ x, y });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < REAL_BOARD_SIZE.height) {
        setSmallScreen(true);
      } else {
        setSmallScreen(false);
      }

      setPosition({ x: position.x, y: position.y });
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [position.x, position.y]);

  return (
    <div
      className={`relative flex h-screen justify-center `}
      style={{
        alignItems: smallScreen ? 'flex-start' : 'center',
      }}
    >
      <playerPositionContext.Provider
        value={{ x: position.x, y: position.y, setPosition: handleSetPosition }}
      >
        <Players />
        <Background />
      </playerPositionContext.Provider>
    </div>
  );
};

export default Board;
