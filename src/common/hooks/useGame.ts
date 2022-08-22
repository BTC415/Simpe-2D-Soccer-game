import { useContext, useEffect, useState } from 'react';

import { gameContext } from '../context/gameContext';

export const useGame = () => {
  const { game, setGame } = useContext(gameContext);
  const [prevGame, setPrevGame] = useState(game);

  useEffect(() => {
    return () => {
      setPrevGame(game);
    };
  }, [game]);

  const setAdmin = (newAdmin: { id: string; name?: string }) => {
    setGame((prev) => ({
      ...prev,
      admin: { id: newAdmin.id, name: newAdmin.name || prev.admin.name },
    }));
  };

  return { game, prevGame, setGame, setAdmin };
};
