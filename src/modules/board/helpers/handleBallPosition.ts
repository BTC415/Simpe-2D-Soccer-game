import {
  BALL_SIZE,
  MOVE,
  MOVE_BALL,
  PLAYER_SIZE,
  SHOOT_DISTANCE,
} from '@/common/constants/settings';
import { Ball } from '@/common/types/ball.type';
import { Player } from '@/common/types/player.type';

import { makeBallPosition, makePosition } from './makePosition';

export const handleBallPosition = (
  ball: Ball,
  players: Map<string, Player>,
  reverse: boolean,
  callback: () => void
): [Ball, Map<string, Player>] => {
  const newBall = ball;
  const newPlayers = new Map(players);

  const { velocityVector, position } = newBall;

  const decelerationX =
    velocityVector.x > 4 || velocityVector.x < -4
      ? MOVE_BALL.DECELERATION
      : MOVE_BALL.SMALL_DECELERATION;

  if (velocityVector.x > 0) {
    velocityVector.x = Math.max(velocityVector.x - decelerationX, 0);
  } else if (velocityVector.x < 0) {
    velocityVector.x = Math.min(velocityVector.x + decelerationX, 0);
  }

  const decelerationY =
    velocityVector.y > 3 || velocityVector.y < -3
      ? MOVE_BALL.DECELERATION
      : MOVE_BALL.SMALL_DECELERATION;

  if (velocityVector.y > 0) {
    velocityVector.y = Math.max(velocityVector.y - decelerationY, 0);
  } else if (velocityVector.y < 0) {
    velocityVector.y = Math.min(velocityVector.y + decelerationY, 0);
  }

  newBall.velocityVector = velocityVector;

  // eslint-disable-next-line prefer-const
  let [newPosition, multiplier] = makeBallPosition(
    position.x + velocityVector.x,
    position.y + velocityVector.y
  );
  newBall.velocityVector.x = velocityVector.x * multiplier.x;
  newBall.velocityVector.y = velocityVector.y * multiplier.y;

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
      callback();
      const unitX = distanceX / length;
      const unitY = distanceY / length;

      newBall.velocityVector = {
        x: unitX * 11,
        y: unitY * 11,
      };
    } else if (length < COLLISION_DISTANCE + 1) {
      callback();
      const unitX = distanceX / length;
      const unitY = distanceY / length;

      const playerSpeedX = Math.min(
        Math.abs(playerCollision.velocityVector.x * 2 || 1.5),
        MOVE.MAX_SPEED
      );
      const playerSpeedY = Math.min(
        Math.abs(playerCollision.velocityVector.y * 2 || 1.5),
        MOVE.MAX_SPEED
      );

      const vX = (velocityVector.x - unitX * playerSpeedX) / 10;
      const vY = (velocityVector.y - unitY * playerSpeedY) / 10;

      const newVX = velocityVector.x - vX;
      const newVY = velocityVector.y - vY;

      newBall.velocityVector = {
        x: newVX,
        y: newVY,
      };

      [newPosition] = makeBallPosition(
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
