import { createContext } from 'react';

export const playerPositionContext = createContext<{
  x: number;
  y: number;
  setPosition: ({ x, y }: { x: number; y: number }) => void;
}>({
  x: 0,
  y: 0,
  setPosition: () => {},
});
