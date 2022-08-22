import { Player } from './player.type';

export type Game = {
  id: string;
  admin: {
    id: string;
    name: string;
  };
  scores: [number, number];
  secondsLeft: number;
  players: Map<string, Player>;
};
