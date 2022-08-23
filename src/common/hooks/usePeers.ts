import { useContext } from 'react';

import { gameContext } from '../context/gameContext';

export const usePeers = () => {
  const {
    peers,
    setPeers,
    game: {
      admin: { id },
    },
  } = useContext(gameContext);

  const adminPeer = peers.get(id);

  return { peers, setPeers, adminPeer };
};
