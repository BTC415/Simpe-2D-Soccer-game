export type Direction = { x: -1 | 0 | 1; y: -1 | 0 | 1 };

export type Player = {
  id: string;
  name: string;
  // team: 'red' | 'blue';
  position: { x: number; y: number };
  direction: Direction;
  velocityVector: { x: number; y: number };
  // score: number;
};
