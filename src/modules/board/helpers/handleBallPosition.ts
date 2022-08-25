import {
  BALL_SIZE,
  MOVE_AREA_SIZE,
  MOVE_BALL,
  PLAYER_SIZE,
  REAL_BOARD_SIZE,
  SHOOT_DISTANCE,
} from '@/common/constants/settings';
import { Ball } from '@/common/types/ball.type';
import { Player } from '@/common/types/player.type';

import { makeBallPosition, makePosition } from './makePosition';

const BALL_AREA = BALL_SIZE + MOVE_AREA_SIZE;

export const handleBallPosition = (
  ball: Ball,
  players: Map<string, Player>,
  reverse: boolean
): [Ball, Map<string, Player>] => {
  const newBall = ball;
  const newPlayers = new Map(players);

  const { velocityVector, position } = newBall;

  if (velocityVector.x > 0) {
    velocityVector.x = Math.max(velocityVector.x - MOVE_BALL.DECELERATION, 0);
  } else if (velocityVector.x < 0) {
    velocityVector.x = Math.min(velocityVector.x + MOVE_BALL.DECELERATION, 0);
  }

  if (velocityVector.y > 0) {
    velocityVector.y = Math.max(velocityVector.y - MOVE_BALL.DECELERATION, 0);
  } else if (velocityVector.y < 0) {
    velocityVector.y = Math.min(velocityVector.y + MOVE_BALL.DECELERATION, 0);
  }

  newBall.velocityVector = velocityVector;

  let newPosition = makeBallPosition(
    position.x + velocityVector.x,
    position.y + velocityVector.y
  );

  if (
    newPosition.x === BALL_AREA ||
    newPosition.x === REAL_BOARD_SIZE.width - BALL_AREA
  )
    newBall.velocityVector.x = velocityVector.x * -0.85;

  if (
    newPosition.y === BALL_AREA ||
    newPosition.y === REAL_BOARD_SIZE.height - BALL_AREA
  )
    newBall.velocityVector.y = velocityVector.y * -0.85;

  const COLLISION_DISTANCE = PLAYER_SIZE + BALL_SIZE;

  const playersArr = [...newPlayers];
  if (reverse) playersArr.reverse();

  playersArr.forEach(([playerCollisionId, playerCollision]) => {
    const distanceX = newPosition.x - playerCollision.position.x;
    const distanceY = newPosition.y - playerCollision.position.y;
    const length = Math.sqrt(distanceX ** 2 + distanceY ** 2) || 1;

    if (
      playerCollision.shoot &&
      length < COLLISION_DISTANCE + SHOOT_DISTANCE + 1
    ) {
      const unitX = distanceX / length;
      const unitY = distanceY / length;

      newBall.velocityVector = {
        x: unitX * 5,
        y: unitY * 5,
      };
    } else if (length < COLLISION_DISTANCE + 1) {
      const unitX = distanceX / length;
      const unitY = distanceY / length;

      const playerSpeedX = Math.min(
        Math.abs(playerCollision.velocityVector.x * 2 || 1.5),
        2.5
      );
      const playerSpeedY = Math.min(
        Math.abs(playerCollision.velocityVector.y * 2 || 1.5),
        2.5
      );

      const vX = (velocityVector.x - unitX * playerSpeedX) / 10;
      const vY = (velocityVector.y - unitY * playerSpeedY) / 10;

      const newVX = velocityVector.x - vX;
      const newVY = velocityVector.y - vY;

      newBall.velocityVector = {
        x: newVX,
        y: newVY,
      };

      newPosition = makeBallPosition(
        playerCollision.position.x + (COLLISION_DISTANCE + 1) * unitX,
        playerCollision.position.y + (COLLISION_DISTANCE + 1) * unitY
      );

      newPlayers.set(playerCollisionId, {
        ...playerCollision,
        position: makePosition(
          playerCollision.position.x - unitX,
          playerCollision.position.y - unitY
        ),
      });
    }
  });

  newBall.position = newPosition;

  return [newBall, newPlayers];
};
