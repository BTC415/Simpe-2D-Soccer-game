import { useEffect } from 'react';

import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useAdmin } from '@/common/hooks/useAdmin';
import { socket } from '@/common/libs/socket';
import Board from '@/modules/board';
import GameInfo from '@/modules/gameInfo';
import { Toggler } from '@/modules/menu';

const GamePage: NextPage = () => {
  const { setAdmin } = useAdmin();

  const router = useRouter();

  useEffect(() => {
    const { gameId } = router.query;
    if (gameId) socket.emit('join_game', '', gameId.toString());

    socket.on('game_joined', (_, id) => {
      setAdmin({ id, name: '' });
    });
    socket.on('game_not_found', () => router.push('/'));

    return () => {
      socket.off('game_joined');
      socket.off('game_not_found');
    };
  }, [router, setAdmin]);

  return (
    <div>
      <GameInfo />
      <Board />
      <Toggler />
    </div>
  );
};

export default GamePage;
