import { useEffect } from 'react';

import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useGame } from '@/common/hooks/useGame';
import { socket } from '@/common/libs/socket';
import Board from '@/modules/board';
import GameInfo from '@/modules/gameInfo';
import EnterName from '@/modules/joinlink';
import { Toggler } from '@/modules/menu';
import { useModal } from '@/modules/modal';

const GamePage: NextPage = () => {
  const { game } = useGame();
  const { openModal } = useModal();

  const router = useRouter();

  useEffect(() => {
    const { gameId } = router.query;
    if (gameId && !game.admin.id) socket.emit('check_game', gameId.toString());

    socket.on('game_found', () => {
      openModal(<EnterName />, false);
    });
    socket.on('game_not_found', () => router.push('/'));

    return () => {
      socket.off('game_found');
      socket.off('game_not_found');
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.admin.id, router]);

  return (
    <div>
      {/* <Flag code={code} /> */}
      <GameInfo />
      <Board />
      <Toggler />
    </div>
  );
};

export default GamePage;
