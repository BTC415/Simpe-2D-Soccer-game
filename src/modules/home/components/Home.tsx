import { useEffect, useState } from 'react';

import { socket } from '@/common/libs/socket';

import GameInputs from './GameInputs';
import Header from './Header';

const Home = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    socket.emit('leave_game');
  }, []);

  return (
    <div className="flex justify-center py-24">
      <div className="flex w-max flex-col items-center">
        <Header />

        <label>
          <p>Enter your name</p>
          <input
            type="text"
            className="h-8 w-72 rounded-lg bg-zinc-500/40 px-4 ring-green-500 focus:outline-none focus:ring"
            placeholder="Player"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <div className="my-10 h-px w-full bg-zinc-500/40" />

        <GameInputs name={name} />
      </div>
    </div>
  );
};

export default Home;
