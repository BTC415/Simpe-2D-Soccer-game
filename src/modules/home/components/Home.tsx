import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import { DEFAULT_GAME } from '@/common/context/gameContext';
import { useGame } from '@/common/hooks/useGame';
import { usePeers } from '@/common/hooks/usePeers';
import { socket } from '@/common/libs/socket';
import { Help } from '@/modules/menu';
import { useModal } from '@/modules/modal';

import GameInputs from './GameInputs';
import Header from './Header';

const Home = () => {
  const { setGame } = useGame();
  const { setPeers, peers } = usePeers();
  const { closeModal, openModal } = useModal();

  const [name, setName] = useState('');

  useEffect(() => {
    toast.dismiss();

    setName(localStorage.getItem('name') || '');

    closeModal();
    setGame({ ...DEFAULT_GAME, players: new Map() });
    peers.forEach((peer) => peer.destroy());
    setPeers(new Map());
    socket.emit('leave_game');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center py-24">
      <div className="flex w-max flex-col items-center">
        <Header />

        <button
          className="mb-5 rounded-lg text-2xl font-bold text-yellow-300 transition-transform hover:scale-105 active:scale-100"
          onClick={() => openModal(<Help />)}
        >
          How to play?
        </button>

        <label>
          <p>Enter your name</p>
          <input
            type="text"
            className="h-8 w-72 rounded-lg bg-zinc-500/40 px-4 ring-green-500 focus:outline-none focus:ring"
            placeholder="Player"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              localStorage.setItem('name', e.target.value);
            }}
          />
        </label>

        <div className="my-10 h-px w-full bg-zinc-500/40" />

        <GameInputs name={name} />
      </div>
    </div>
  );
};

export default Home;
