import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

import { useGame } from '@/common/hooks/useGame';
import { PlayerTeam } from '@/common/types/player.type';

const SpectateControls = ({
  setSpectating,
  spectating,
}: {
  setSpectating: (id: string) => void;
  spectating: string;
}) => {
  const {
    game: { players },
  } = useGame();

  const playingPlayers = Array.from(players.entries()).filter(
    ([_key, player]) => player.team !== PlayerTeam.SPECTATOR
  );

  const spectatingPlayerIndex = playingPlayers.findIndex(
    ([key]) => key === spectating
  );

  return (
    <div className="absolute bottom-24 z-20 rounded-lg bg-zinc-900 p-3 text-center">
      <p>Spectating:</p>
      <div className="flex items-center gap-5">
        <button
          className="cursor-pointer rounded-full p-2 text-2xl hover:scale-105 active:scale-100"
          onClick={() => {
            if (spectatingPlayerIndex - 1 < -1)
              setSpectating(playingPlayers[playingPlayers.length - 1][0]);
            else
              setSpectating(
                playingPlayers[spectatingPlayerIndex - 1]?.[0] || 'none'
              );
          }}
        >
          <BsChevronLeft />
        </button>
        <p className="w-24 overflow-hidden text-ellipsis text-center text-green-500">
          {playingPlayers[spectatingPlayerIndex]?.[1].name || 'None'}
        </p>
        <button
          className="cursor-pointer rounded-full p-2 text-2xl hover:scale-105 active:scale-100"
          onClick={() => {
            if (spectatingPlayerIndex + 1 > playingPlayers.length)
              setSpectating(playingPlayers[0][0]);
            else
              setSpectating(
                playingPlayers[spectatingPlayerIndex + 1]?.[0] || 'none'
              );
          }}
        >
          <BsChevronRight />
        </button>
      </div>
    </div>
  );
};

export default SpectateControls;
