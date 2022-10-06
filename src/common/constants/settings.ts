export const BOARD_SIZE = {
  width: 1500,
  height: 900,
};

export const PLAYER_SIZE = 30;

export const LINE_WIDTH = 4;

export const SHOOT_DISTANCE = 7;

export const BALL_SIZE = 22;

export const MOVE_AREA_SIZE = PLAYER_SIZE * 2 + 5;

export const REAL_BOARD_SIZE = {
  width: BOARD_SIZE.width + MOVE_AREA_SIZE * 2,
  height: BOARD_SIZE.height + MOVE_AREA_SIZE * 2,
};

export const GOAL_POSITION = {
  fromLeft: 2,
  height: 125,
};

export const TICKRATE = 64;

export const MOVE = {
  MAX_SPEED: 3,
  ACCELERATION: 0.2,
  DECELERATION: 0.05,
};

export const MOVE_BALL = {
  MAX_SPEED: 5,
  ACCELERATION: 0.35,
  DECELERATION: 0.12,
  SMALL_DECELERATION: 0.015,
};
