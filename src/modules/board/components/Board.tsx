import { useState } from 'react';

import { REAL_BOARD_SIZE } from '@/common/constants/settings';

import { playerPositionContext } from '../context/playerPosition';
import Background from './Background';
import Players from './Players';

const Board = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleSetPosition = ({ x, y }: { x: number; y: number }) => {
    setPosition({ x, y });
  };

  let smallScreen = false;
  if (
    typeof window !== 'undefined' &&
    window.innerHeight < REAL_BOARD_SIZE.height
  )
    smallScreen = true;

  return (
    <div
      className={`relative flex h-screen justify-center ${
        !smallScreen ? 'items-center' : 'items-start'
      }`}
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
