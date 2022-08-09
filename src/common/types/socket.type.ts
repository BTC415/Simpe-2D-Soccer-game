import type { GameClient } from './game.type';
import type { Direction } from './player.type';

export interface ClientToServer {
  create_game: (name: string) => void;
  join_game: (name: string, gameId: string) => void;
  leave_game: () => void;
  change_direction: (direction: Direction) => void;
}

export interface ServerToClient {
  game_joined: (gameId: string) => void;
  game_not_found: () => void;
  update: (game: GameClient) => void;
}
