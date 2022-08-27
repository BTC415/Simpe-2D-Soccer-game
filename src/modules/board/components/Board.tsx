import { useEffect, useState } from 'react';

import { REAL_BOARD_SIZE } from '@/common/constants/settings';
import { useGame } from '@/common/hooks/useGame';
import { socket } from '@/common/libs/socket';
import Menu from '@/modules/menu';
import { useModal } from '@/modules/modal';

import { playerPositionContext } from '../context/playerPosition';
import Background from './Background';
import Movables from './Movables';
import ScoreSignal from './ScoreSignal';

const Board = () => {
  const { game, prevGame } = useGame();
  const { openModal, closeModal } = useModal();

  const [smallScreen, setSmallScreen] = useState(false);
  const [position, setPosition] = useState({
    x: REAL_BOARD_SIZE.width / 2,
    y: REAL_BOARD_SIZE.height / 2,
  });

  const handleSetPosition = ({ x, y }: { x: number; y: number }) => {
    setPosition({ x, y });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < REAL_BOARD_SIZE.height) {
        setSmallScreen(true);
      } else {
        setSmallScreen(false);
      }

      setPosition({ x: position.x, y: position.y });
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [position.x, position.y]);

  useEffect(() => {
    if (!game.started) openModal(<Menu />, false);
    else if (!prevGame.started && game.started) closeModal();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.started, prevGame.started]);

  return (
    <div
      className="relative flex h-screen justify-center"
      style={{
        alignItems: smallScreen ? 'flex-start' : 'center',
      }}
    >
      {(game.paused || !game.started) && game.players.has(socket.id) && (
        <div className="absolute z-20 flex h-full w-full items-center justify-center bg-black/50 backdrop-blur-sm">
          {game.paused && game.started && <p className="text-6xl">PAUSED</p>}
          {!game.started && <p className="text-6xl">WAITING FOR START</p>}
        </div>
      )}

      <ScoreSignal />

      <playerPositionContext.Provider
        value={{ x: position.x, y: position.y, setPosition: handleSetPosition }}
      >
        <Movables />
        <Background />
      </playerPositionContext.Provider>
    </div>
  );
};

export default Board;
