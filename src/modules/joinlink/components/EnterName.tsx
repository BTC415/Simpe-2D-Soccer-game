import { FormEvent, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useGame } from '@/common/hooks/useGame';
import { socket } from '@/common/libs/socket';
import { useModal } from '@/modules/modal';

const EnterName = () => {
  const { setAdmin } = useGame();
  const { closeModal } = useModal();

  const [name, setName] = useState('');

  const router = useRouter();

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { gameId } = router.query;
    if (gameId) {
      socket.emit('join_game', name, gameId.toString());
    } else closeModal();
  };

  useEffect(() => {
    socket.on('game_joined', (_, id) => {
      setAdmin({ id });
    });

    return () => {
      socket.off('game_joined');
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form onSubmit={handleJoinRoom}>
      <label>
        <p>Enter your name</p>
        <input
          type="text"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Player"
        />
      </label>
      <button className="btn mt-3" type="submit">
        Join game
      </button>
    </form>
  );
};

export default EnterName;
