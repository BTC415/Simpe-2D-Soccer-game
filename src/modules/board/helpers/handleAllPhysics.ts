import { Ball } from '@/common/types/ball.type';
import { Player, PlayerTeam } from '@/common/types/player.type';

import { handleBallPosition } from './handleBallPosition';
import { handlePlayersMovement } from './handlePlayersMovement';

export const handleAllPhysics = (
  { ball, players }: { ball: Ball; players: Map<string, Player> },
  reverse: boolean,
  blocked: boolean,
  teamUnblocked: PlayerTeam,
  callback: () => void
): [Ball, Map<string, Player>] => {
  return handleBallPosition(
    ball,
    handlePlayersMovement(players, reverse, blocked, teamUnblocked),
    reverse,
    callback
  );
};
