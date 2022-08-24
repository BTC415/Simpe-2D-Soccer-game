import { useEffect } from 'react';

import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useGame } from '@/common/hooks/useGame';
import { socket } from '@/common/libs/socket';
import Board from '@/modules/board';
import GameInfo from '@/modules/gameInfo';
import { Toggler } from '@/modules/menu';

const GamePage: NextPage = () => {
  const { setAdmin, game } = useGame();

  const router = useRouter();

  useEffect(() => {
    const { gameId } = router.query;
    if (gameId && !game.admin.id)
      socket.emit('join_game', '', gameId.toString());

    socket.on('game_joined', (_, id) => {
      setAdmin({ id });
    });
    socket.on('game_not_found', () => router.push('/'));

    return () => {
      socket.off('game_joined');
      socket.off('game_not_found');
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <div>
      <GameInfo />
      <Board />
      <Toggler />
    </div>
  );
};

export default GamePage;
