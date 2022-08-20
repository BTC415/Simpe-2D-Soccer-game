export const BOARD_SIZE = {
  width: 1900,
  height: 1000,
  rounded: 50,
};

export const PLAYER_SIZE = 30;

export const MOVE_AREA_SIZE = PLAYER_SIZE * 2;

export const REAL_BOARD_SIZE = {
  width: BOARD_SIZE.width + MOVE_AREA_SIZE * 2,
  height: BOARD_SIZE.height + MOVE_AREA_SIZE * 2,
};

export const TICKRATE = 128;

export const MOVE = {
  MAX_SPEED: 1.25,
  ACCELERATION: 0.035,
  DECELERATION: 0.012,
};
