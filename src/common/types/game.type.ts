import type { Player } from './player.type';

export type Game = {
  id: string;
  players: Map<string, Player>;
};

export type GameClient = {
  id: string;
  players: Player[];
};
