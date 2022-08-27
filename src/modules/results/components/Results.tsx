import { useGame } from '@/common/hooks/useGame';
import { socket } from '@/common/libs/socket';

const Results = () => {
  const {
    stopGame,
    game: { scores, admin },
  } = useGame();

  const tie = scores[0] === scores[1];
  const blueWon = scores[0] > scores[1];

  return (
    <div className="flex flex-col text-center">
      <p
        className={`text-3xl font-bold ${blueWon && !tie && 'text-blue-500'} ${
          !blueWon && !tie && 'text-red-500'
        }`}
      >
        {tie && 'DRAW!'}
        {blueWon && !tie && 'BLUE WIN!'}
        {!blueWon && !tie && 'RED WIN!'}
      </p>

      <div className="mt-2 mb-5 grid w-full grid-cols-2">
        <p>BLUE</p>
        <p>RED</p>

        <p className="text-2xl">{scores[0]}</p>
        <p className="text-2xl">{scores[1]}</p>
      </div>

      {socket.id === admin.id && (
        <button onClick={stopGame} className="btn">
          Play again
        </button>
      )}
      {socket.id !== admin.id && <p>Waiting for host...</p>}
    </div>
  );
};

export default Results;
