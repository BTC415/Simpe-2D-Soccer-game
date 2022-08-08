import type { NextPage } from 'next';

import Board from '@/modules/board';
import GameInfo from '@/modules/gameInfo';

const GamePage: NextPage = () => {
  return (
    <div>
      <GameInfo />
      <Board />
    </div>
  );
};

export default GamePage;
