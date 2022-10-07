import { useEffect } from 'react';

import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useGame } from '@/common/hooks/useGame';
import { socket } from '@/common/libs/socket';
import { Board, GameInfo } from '@/modules/game';
import { Toggler } from '@/modules/game/modules/menu';
import EnterName from '@/modules/joinlink';
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
