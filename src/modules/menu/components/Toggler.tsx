import { useEffect } from 'react';

import { BiHelpCircle } from 'react-icons/bi';
import { FiMenu } from 'react-icons/fi';

import { PLAYER_SIZE } from '@/common/constants/settings';
import { useGame } from '@/common/hooks/useGame';
import { useModal } from '@/modules/modal';

import Help from './Help';
import Menu from './Menu';

const Toggler = () => {
  const { openModal, closeModal, modal } = useModal();
  const {
    game: { started },
  } = useGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && started) {
        if (modal) {
          closeModal();
          (document.activeElement as HTMLElement).blur();
        } else {
          openModal(<Menu />);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal, modal, openModal, started]);

  return (
    <div className="absolute bottom-0 left-0 z-20 w-full">
      <div
        className="relative flex w-full items-center justify-center bg-black/40 backdrop-blur-sm"
        style={{ height: PLAYER_SIZE * 2 }}
      >
        <button className="btn" onClick={() => openModal(<Menu />)}>
          <FiMenu className="text-black" />
          Menu
        </button>

        <button
          className="btn absolute right-10 w-min p-3 py-6 text-2xl"
          onClick={() => openModal(<Help />)}
        >
          <BiHelpCircle />
        </button>
      </div>
    </div>
  );
};

export default Toggler;
