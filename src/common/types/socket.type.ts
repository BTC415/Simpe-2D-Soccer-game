import { SignalData } from 'simple-peer';

import { SimplePlayer } from './player.type';

export interface ClientToServer {
  create_game: (name: string) => void;
  join_game: (name: string, gameId: string) => void;
  check_game: (gameId: string) => void;
  leave_game: () => void;

  signal_received: (signal: SignalData, toPlayerId: string) => void;
}

export interface ServerToClient {
  game_joined: (gameId: string, adminId: string) => void;
  game_not_found: () => void;
  game_found: () => void;
  player_joined: (player: SimplePlayer) => void;
  player_left: (playerId: string) => void;
  admin_change: (newAdminId: string) => void;

  player_signal: (signal: SignalData, fromPlayerId: string) => void;
}
