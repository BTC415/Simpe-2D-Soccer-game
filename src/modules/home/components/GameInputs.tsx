import { FormEvent, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useGame } from '@/common/hooks/useGame';
import { socket } from '@/common/libs/socket';

const GameInputs = ({ name }: { name: string }) => {
  const { setAdmin } = useGame();

  const [gameId, setGameId] = useState('');

  const router = useRouter();

  useEffect(() => {
    socket.on('game_joined', (serverGameId, id) => {
      setAdmin({
        id,
        name,
      });

      router.push(serverGameId);
    });

    return () => {
      socket.off('game_joined');
    };
  }, [name, router, setAdmin]);

  const handleJoinGame = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    socket.emit('join_game', name, gameId);
  };

  const handleCreateGame = () => {
    socket.emit('create_game', name);
  };

  return (
    <>
      <form onSubmit={handleJoinGame}>
        <label>
          <p>Enter game id</p>
          <input
            type="text"
            className="input"
            placeholder="Game id..."
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
        </label>
        <button className="btn mt-3" type="submit">
          Join game
        </button>
      </form>

      <div className="flex w-full items-center gap-3">
        <div className="my-10 h-px flex-1 bg-zinc-500/40" />
        <p className="text-zinc-500/50">or</p>
        <div className="my-10 h-px flex-1 bg-zinc-500/40" />
      </div>

      <button className="btn" onClick={handleCreateGame}>
        Create game
      </button>
    </>
  );
};

export default GameInputs;
