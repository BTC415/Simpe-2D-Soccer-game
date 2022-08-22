import { createContext, Dispatch, SetStateAction, useState } from 'react';

import { Game } from '../types/game.type';

const gameContext = createContext<{
  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
}>(null!);

const GameProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [game, setGame] = useState<Game>({
    id: '',
    admin: {
      name: '',
      id: '',
    },
    scores: [0, 0],
    secondsLeft: 300,
    players: new Map(),
  });

  return (
    <gameContext.Provider
      value={{
        game,
        setGame,
      }}
    >
      {children}
    </gameContext.Provider>
  );
};

export { gameContext };

export default GameProvider;
