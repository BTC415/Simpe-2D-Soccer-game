import { useEffect } from 'react';

import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { socket } from '@/common/libs/socket';
import Board from '@/modules/board';
import GameInfo from '@/modules/gameInfo';

const GamePage: NextPage = () => {
  const { gameId } = useRouter().query;

  useEffect(() => {
    if (gameId) socket.emit('join_game', '', gameId.toString());
  }, [gameId]);

  return (
    <div>
      <GameInfo />
      <Board />
    </div>
  );
};

export default GamePage;
