import { PLAYER_SIZE, REAL_BOARD_SIZE } from '@/common/constants/settings';

export const makePosition = (x: number, y: number) => {
  const newX = Math.max(
    Math.min(x, REAL_BOARD_SIZE.width - PLAYER_SIZE),
    PLAYER_SIZE
  );
  const newY = Math.max(
    Math.min(y, REAL_BOARD_SIZE.height - PLAYER_SIZE),
    PLAYER_SIZE
  );

  return { x: newX, y: newY };
};
