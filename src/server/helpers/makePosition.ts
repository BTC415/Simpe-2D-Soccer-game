import { BOARD_SIZE, PLAYER_SIZE } from '../constants/settings';

export const makePosition = (x: number, y: number) => {
  const newX = Math.max(
    Math.min(x, BOARD_SIZE.width - PLAYER_SIZE),
    PLAYER_SIZE
  );
  const newY = Math.max(
    Math.min(y, BOARD_SIZE.height - PLAYER_SIZE),
    PLAYER_SIZE
  );

  return { x: newX, y: newY };
};
