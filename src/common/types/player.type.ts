export type Direction = { x: -1 | 0 | 1; y: -1 | 0 | 1 };

export type SimplePlayer = {
  id: string;
  name: string;
};

export enum PlayerTeam {
  BLUE,
  RED,
  SPECTATOR,
}

export interface Player {
  index: number;
  name: string;
  team: PlayerTeam;
  position: { x: number; y: number };
  direction: Direction;
  velocityVector: { x: number; y: number };
  // score: number;
}
