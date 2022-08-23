import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  BsFillPauseFill,
  BsFillPlayFill,
  BsFillStopFill,
} from 'react-icons/bs';
import { HiChevronLeft } from 'react-icons/hi';

import { useGame } from '@/common/hooks/useGame';
import { socket } from '@/common/libs/socket';
import { useModal } from '@/modules/modal';

import TeamSelect from './TeamSelect';

const Menu = () => {
  const { game, setGame } = useGame();
  const { closeModal } = useModal();

  const { gameId } = useRouter().query;

  return (
    <div>
      {!game.started && (
        <p className="text-center text-2xl font-bold text-red-500">
          WAITING FOR START
        </p>
      )}

      {game.paused && (
        <p className="text-center text-2xl font-bold text-red-500">
          GAME PAUSED
        </p>
      )}

      <p className="text-center text-lg">
        Room id: <span className="font-bold text-green-500">{gameId}</span>
      </p>

      <TeamSelect />

      <div className="mt-5 flex justify-end gap-5">
        {game.started && socket.id === game.admin.id && (
          <>
            <button
              className="btn w-40 bg-red-500 from-red-500"
              onClick={() => setGame((prev) => ({ ...prev, started: false }))}
            >
              <BsFillStopFill />
              Stop game
            </button>
            <button
              className="btn w-40 bg-gray-500 from-gray-500"
              onClick={() =>
                setGame((prev) => ({ ...prev, paused: !prev.paused }))
              }
            >
              {game.paused && (
                <>
                  <BsFillPlayFill />
                  Resume game
                </>
              )}
              {!game.paused && (
                <>
                  <BsFillPauseFill />
                  Pause game
                </>
              )}
            </button>
          </>
        )}
        {!game.started && socket.id === game.admin.id && (
          <button
            className="btn w-40 bg-green-500 from-green-500"
            onClick={() => setGame((prev) => ({ ...prev, started: true }))}
          >
            <BsFillPlayFill />
            Start game
          </button>
        )}

        <Link href="/">
          <button
            className="btn w-40 bg-red-500 from-red-500"
            onClick={closeModal}
          >
            <HiChevronLeft />
            Leave game
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Menu;
