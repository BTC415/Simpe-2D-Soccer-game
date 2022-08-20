import { Direction, Player } from './player.type';

export type DataType = 'update' | 'direction' | 'shoot';

export type Data = {
  type: DataType;
};

export type UpdateData = {
  type: 'update';
  players: [string, Player][];
};

export type DirectionData = {
  type: 'direction';
  direction: Direction;
};

export type ShootData = {
  type: 'shoot';
};
