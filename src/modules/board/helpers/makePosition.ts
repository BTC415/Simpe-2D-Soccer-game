import {
  BALL_SIZE,
  GOAL_POSITION,
  LINE_WIDTH,
  MOVE_AREA_SIZE,
  PLAYER_SIZE,
  REAL_BOARD_SIZE,
} from '@/common/constants/settings';

export const makePosition = (x: number, y: number) => {
  const newX = Math.max(
    Math.min(x, REAL_BOARD_SIZE.width - PLAYER_SIZE),
    PLAYER_SIZE
  );
  const newY = Math.max(
    Math.min(y, REAL_BOARD_SIZE.height - PLAYER_SIZE),
    PLAYER_SIZE
  );

  return { x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 };
};

export const makeBallPosition = (x: number, y: number) => {
  let areaToBlock = MOVE_AREA_SIZE;

  if (
    y < REAL_BOARD_SIZE.height / 2 + GOAL_POSITION.height - BALL_SIZE &&
    y > REAL_BOARD_SIZE.height / 2 - GOAL_POSITION.height + BALL_SIZE
  ) {
    areaToBlock = 0;
  }

  const maxX = BALL_SIZE + areaToBlock + LINE_WIDTH;
  const minX = REAL_BOARD_SIZE.width - BALL_SIZE - areaToBlock - LINE_WIDTH;

  const newX = Math.max(Math.min(x, minX), maxX);

  let newY = 0;
  let maxY = BALL_SIZE + MOVE_AREA_SIZE + LINE_WIDTH;
  let minY = REAL_BOARD_SIZE.height - BALL_SIZE - MOVE_AREA_SIZE - LINE_WIDTH;
  if (
    x < MOVE_AREA_SIZE + BALL_SIZE - LINE_WIDTH ||
    x > REAL_BOARD_SIZE.width - MOVE_AREA_SIZE - BALL_SIZE + LINE_WIDTH
  ) {
    maxY =
      REAL_BOARD_SIZE.height / 2 -
      GOAL_POSITION.height +
      BALL_SIZE +
      LINE_WIDTH;
    minY =
      REAL_BOARD_SIZE.height / 2 +
      GOAL_POSITION.height -
      BALL_SIZE -
      LINE_WIDTH;
  }

  newY = Math.max(Math.min(y, minY), maxY);

  const multiplier = { x: 1, y: 1 };
  if (newX === maxX || newX === minX) multiplier.x = -0.85;
  if (newY === maxY || newY === minY) multiplier.y = -0.85;

  return [
    {
      x: Math.round(newX * 10) / 10,
      y: Math.round(newY * 10) / 10,
    },
    multiplier,
  ];
};
