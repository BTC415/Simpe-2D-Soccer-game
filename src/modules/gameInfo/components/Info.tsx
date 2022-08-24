import { PLAYER_SIZE } from '@/common/constants/settings';
import { useGame } from '@/common/hooks/useGame';

const Info = () => {
  const {
    game: { secondsLeft, scores },
  } = useGame();

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft - minutes * 60;

  return (
    <div
      className="absolute z-30 flex w-full items-center bg-black/40 backdrop-blur-sm"
      style={{ height: PLAYER_SIZE * 2 }}
    >
      <div className="flex w-full items-center justify-center gap-72 text-3xl">
        <p className="font-black text-blue-500">BLUE TEAM</p>

        <div className="flex w-72 items-center justify-center gap-10">
          <p className="text-5xl font-black text-blue-500">{scores[0]}</p>
          <p className="font-black">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </p>
          <p className="text-5xl font-black text-red-500">{scores[1]}</p>
        </div>

        <p className="text-3xl font-black text-red-500">RED TEAM</p>
      </div>
    </div>
  );
};

export default Info;
