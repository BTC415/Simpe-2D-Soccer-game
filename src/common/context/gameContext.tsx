import { createContext, Dispatch, SetStateAction, useState } from 'react';

import { Game, StatusPeer } from '../types/game.type';

export const DEFAULT_GAME: Game = {
  id: '',
  admin: {
    name: '',
    id: '',
  },
  scores: [0, 0],
  secondsLeft: 300,
  players: new Map(),
};

const gameContext = createContext<{
  game: Game;
  setGame: Dispatch<SetStateAction<Game>>;
  status: StatusPeer;
  setStatus: Dispatch<SetStateAction<StatusPeer>>;
}>(null!);

const GameProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [game, setGame] = useState<Game>(DEFAULT_GAME);
  const [status, setStatus] = useState<StatusPeer>(StatusPeer.CONNECTED);

  return (
    <gameContext.Provider
      value={{
        game,
        setGame,
        status,
        setStatus,
      }}
    >
      {children}
    </gameContext.Provider>
  );
};

export { gameContext };

export default GameProvider;
