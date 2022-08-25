import { Ball } from '@/common/types/ball.type';
import { Player } from '@/common/types/player.type';

import { handleBallPosition } from './handleBallPosition';
import { handlePlayersMovement } from './handlePlayersMovement';

export const handleAllPhysics = (
  { ball, players }: { ball: Ball; players: Map<string, Player> },
  reverse: boolean
): [Ball, Map<string, Player>] => {
  return handleBallPosition(
    ball,
    handlePlayersMovement(players, reverse),
    reverse
  );
};
