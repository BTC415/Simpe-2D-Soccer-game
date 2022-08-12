import { FiMenu } from 'react-icons/fi';

import { PLAYER_SIZE } from '@/common/constants/settings';
import { useModal } from '@/modules/modal';

import Menu from './Menu';

const Toggler = () => {
  const { openModal } = useModal();

  return (
    <div className="absolute top-0 left-0 z-20 flex h-full w-full items-end">
      <div
        className="flex w-full items-center justify-center bg-black/40 backdrop-blur-sm"
        style={{ height: PLAYER_SIZE * 2 }}
      >
        <button className="btn" onClick={() => openModal(<Menu />)}>
          <FiMenu className="text-black" />
          Menu
        </button>
      </div>
    </div>
  );
};

export default Toggler;
