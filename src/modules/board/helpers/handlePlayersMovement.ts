import {
  BOARD_SIZE,
  MOVE,
  MOVE_AREA_SIZE,
  PLAYER_SIZE,
  REAL_BOARD_SIZE,
} from '@/common/constants/settings';
import { Player, PlayerTeam } from '@/common/types/player.type';

import { makePosition } from './makePosition';

export const handlePlayersMovement = (
  players: Map<string, Player>,
  reverse: boolean,
  blocked: boolean,
  teamUnblocked: PlayerTeam
): Map<string, Player> => {
  const newPlayers = new Map(players);

  newPlayers.forEach((player, id) => {
    const { direction, velocityVector, position } = player;

    if (player.team === PlayerTeam.SPECTATOR) return;

    if (direction.x === 1) {
      velocityVector.x = Math.min(
        velocityVector.x + MOVE.ACCELERATION,
        MOVE.MAX_SPEED
      );
    } else if (direction.x === -1) {
      velocityVector.x = Math.max(
        velocityVector.x - MOVE.ACCELERATION,
        -MOVE.MAX_SPEED
      );
    } else if (velocityVector.x > 0) {
      velocityVector.x = Math.max(velocityVector.x - MOVE.DECELERATION, 0);
    } else if (velocityVector.x < 0) {
      velocityVector.x = Math.min(velocityVector.x + MOVE.DECELERATION, 0);
    }

    if (direction.y === 1) {
      velocityVector.y = Math.min(
        velocityVector.y + MOVE.ACCELERATION,
        MOVE.MAX_SPEED
      );
    } else if (direction.y === -1) {
      velocityVector.y = Math.max(
        velocityVector.y - MOVE.ACCELERATION,
        -MOVE.MAX_SPEED
      );
    } else if (velocityVector.y > 0) {
      velocityVector.y = Math.max(velocityVector.y - MOVE.DECELERATION, 0);
    } else if (velocityVector.y < 0) {
      velocityVector.y = Math.min(velocityVector.y + MOVE.DECELERATION, 0);
    }

    let newPosition = makePosition(
      position.x + velocityVector.x,
      position.y + velocityVector.y
    );

    const playersArr = [...newPlayers];
    if (reverse) playersArr.reverse();

    playersArr.forEach(([playerCollisionId, playerCollision]) => {
      if (id === playerCollisionId) return;

      const distanceX = newPosition.x - playerCollision.position.x;
      const distanceY = newPosition.y - playerCollision.position.y;
      const length = Math.sqrt(distanceX ** 2 + distanceY ** 2) || 1;

      if (length < PLAYER_SIZE * 2 + 1) {
        const unitX = distanceX / length;
        const unitY = distanceY / length;

        newPosition = makePosition(
          playerCollision.position.x + (PLAYER_SIZE * 2 + 1) * unitX,
          playerCollision.position.y + (PLAYER_SIZE * 2 + 1) * unitY
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

    const bigCircle = {
      x: BOARD_SIZE.width / 2 + MOVE_AREA_SIZE,
      y: BOARD_SIZE.height / 2 + MOVE_AREA_SIZE,
      radius: 125,
    };

    if (blocked) {
      if (
        player.team === PlayerTeam.RED &&
        (teamUnblocked !== PlayerTeam.RED ||
          newPosition.y + PLAYER_SIZE >
            BOARD_SIZE.height / 2 + MOVE_AREA_SIZE + bigCircle.radius + 5 ||
          newPosition.y - PLAYER_SIZE <
            BOARD_SIZE.height / 2 + MOVE_AREA_SIZE - bigCircle.radius - 5)
      ) {
        newPosition.x = Math.max(
          newPosition.x,
          REAL_BOARD_SIZE.width / 2 + PLAYER_SIZE
        );
      } else if (
        player.team === PlayerTeam.BLUE &&
        (teamUnblocked !== PlayerTeam.BLUE ||
          newPosition.y + PLAYER_SIZE >
            BOARD_SIZE.height / 2 + MOVE_AREA_SIZE + bigCircle.radius + 5 ||
          newPosition.y - PLAYER_SIZE <
            BOARD_SIZE.height / 2 + MOVE_AREA_SIZE - bigCircle.radius - 5)
      ) {
        newPosition.x = Math.min(
          newPosition.x,
          REAL_BOARD_SIZE.width / 2 - PLAYER_SIZE
        );
      }
    }

    const distanceX = newPosition.x - bigCircle.x;
    const distanceY = newPosition.y - bigCircle.y;
    const length = Math.sqrt(distanceX ** 2 + distanceY ** 2) || 1;

    if (teamUnblocked !== PlayerTeam.SPECTATOR) {
      if (
        length <= bigCircle.radius + PLAYER_SIZE &&
        player.team !== teamUnblocked &&
        blocked
      ) {
        const unitX = distanceX / length;
        const unitY = distanceY / length;

        newPosition.x = bigCircle.x + (bigCircle.radius + PLAYER_SIZE) * unitX;
        newPosition.y = bigCircle.y + (bigCircle.radius + PLAYER_SIZE) * unitY;
      } else if (
        length >= bigCircle.radius - PLAYER_SIZE &&
        length <= bigCircle.radius + PLAYER_SIZE &&
        player.team === teamUnblocked &&
        blocked &&
        (player.team === PlayerTeam.RED
          ? position.x < BOARD_SIZE.width / 2 + MOVE_AREA_SIZE
          : position.x > BOARD_SIZE.width / 2 + MOVE_AREA_SIZE)
      ) {
        const unitX = distanceX / length;
        const unitY = distanceY / length;

        newPosition.x = bigCircle.x + (bigCircle.radius - PLAYER_SIZE) * unitX;
        newPosition.y = bigCircle.y + (bigCircle.radius - PLAYER_SIZE) * unitY;
      }
    }

    newPlayers.set(id, {
      ...player,
      position: newPosition,
      velocityVector,
    });
  });

  return newPlayers;
};
