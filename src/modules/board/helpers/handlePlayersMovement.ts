import { MOVE, PLAYER_SIZE } from '@/common/constants/settings';
import { Player, PlayerTeam } from '@/common/types/player.type';

import { makePosition } from './makePosition';

export const handlePlayersMovement = (
  players: Map<string, Player>,
  reverse: boolean
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

    newPlayers.set(id, {
      ...player,
      position: newPosition,
      velocityVector,
    });
  });

  return newPlayers;
};
