import { useEffect } from 'react';

import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { socket } from '@/common/libs/socket';
import Board from '@/modules/board';
import GameInfo from '@/modules/gameInfo';

const GamePage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { gameId } = router.query;
    if (gameId) socket.emit('join_game', '', gameId.toString());

    socket.on('game_not_found', () => router.push('/'));
  }, [router]);

  return (
    <div>
      <GameInfo />
      <Board />
    </div>
  );
};

export default GamePage;
