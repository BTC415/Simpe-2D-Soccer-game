import Link from 'next/link';
import { useRouter } from 'next/router';
import { BsFillPauseFill, BsFillStopFill } from 'react-icons/bs';
import { HiChevronLeft } from 'react-icons/hi';

import { useModal } from '@/modules/modal';

import TeamSelect from './TeamSelect';

const Menu = () => {
  const { closeModal } = useModal();
  const { gameId } = useRouter().query;

  return (
    <div>
      <p className="text-center text-lg">
        Room id: <span className="font-bold text-green-500">{gameId}</span>
      </p>

      <TeamSelect />

      {/* <div draggable>123</div> */}

      <div className="mt-5 flex justify-end gap-5">
        <button className="btn w-36 bg-red-500 from-red-500">
          <BsFillStopFill />
          Stop game
        </button>
        <button className="btn w-36 bg-gray-500 from-gray-500">
          <BsFillPauseFill />
          Pause game
        </button>
        <Link href="/">
          <button
            className="btn w-36 bg-red-500 from-red-500"
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
