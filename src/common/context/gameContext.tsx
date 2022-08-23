import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import type SimplePeer from 'simple-peer';

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
  paused: false,
  started: false,
};

const gameContext = createContext<{
  game: Game;
  prevGame: Game;
  setGame: Dispatch<SetStateAction<Game>>;
  status: StatusPeer;
  setStatus: Dispatch<SetStateAction<StatusPeer>>;
  peers: Map<string, SimplePeer.Instance>;
  setPeers: Dispatch<SetStateAction<Map<string, SimplePeer.Instance>>>;
}>(null!);

const GameProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [game, setGame] = useState(DEFAULT_GAME);
  const [prevGame, setPrevGame] = useState(DEFAULT_GAME);
  const [status, setStatus] = useState<StatusPeer>(StatusPeer.CONNECTED);
  const [peers, setPeers] = useState<Map<string, SimplePeer.Instance>>(
    new Map()
  );

  useEffect(() => {
    return () => {
      setPrevGame(game);
    };
  }, [game]);

  return (
    <gameContext.Provider
      value={{
        game,
        prevGame,
        setGame,
        status,
        setStatus,
        peers,
        setPeers,
      }}
    >
      {children}
    </gameContext.Provider>
  );
};

export { gameContext };

export default GameProvider;
