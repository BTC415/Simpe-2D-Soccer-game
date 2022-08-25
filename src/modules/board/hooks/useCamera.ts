import { useContext } from 'react';

import { PLAYER_SIZE, REAL_BOARD_SIZE } from '@/common/constants/settings';

import { playerPositionContext } from '../context/playerPosition';

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

export const useCamera = () => {
  const { x, y, setPosition } = useContext(playerPositionContext);

  let camX = 0;
  let camY = 0;
  let windowWidth = 0;
  let windowHeight = 0;
  let movableX = false;
  let movableY = false;

  if (typeof window !== 'undefined') {
    if (window.innerWidth < REAL_BOARD_SIZE.width) {
      windowWidth = window.innerWidth;
      movableX = window.innerWidth < REAL_BOARD_SIZE.width;
      const boundyX = (REAL_BOARD_SIZE.width - windowWidth) / 2;
      camX = -clamp(x - REAL_BOARD_SIZE.width / 2, -boundyX, boundyX);
    }

    if (window.innerHeight < REAL_BOARD_SIZE.height) {
      windowHeight = window.innerHeight;
      movableY = window.innerHeight < REAL_BOARD_SIZE.height;
      camY = -clamp(
        y - windowHeight / 2,
        -PLAYER_SIZE * 2,
        REAL_BOARD_SIZE.height - windowHeight + PLAYER_SIZE * 2 + 28
      );
    }
  }

  return {
    camX,
    camY,
    setPosition,
    position: { x, y },
    windowHeight,
    windowWidth,
    movableX,
    movableY,
  };
};
