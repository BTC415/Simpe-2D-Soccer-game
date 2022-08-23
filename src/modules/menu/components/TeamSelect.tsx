import { DragEvent } from 'react';

import { useGame } from '@/common/hooks/useGame';
import { Player, PlayerTeam } from '@/common/types/player.type';
import { socket } from '@/common/libs/socket';

const Team = ({ team }: { team: PlayerTeam }) => {
  const { game, setPlayerTeam } = useGame();

  const playersToRender: Map<string, Player> = new Map();
  game.players.forEach((player, id) => {
    if (player.team === team) playersToRender.set(id, player);
  });

  const handleDropPlayer = (e: DragEvent<HTMLDivElement>) => {
    const playerId = e.dataTransfer.getData('text/plain');

    setPlayerTeam(playerId, team);
  };

  return (
    <div className="flex h-96 w-72 flex-col gap-3">
      <button
        className={`rounded-lg py-1 font-bold transition-colors
        ${
          team === PlayerTeam.BLUE &&
          'bg-blue-500/50 text-blue-200 hover:bg-blue-600/50'
        }
        ${
          team === PlayerTeam.SPECTATOR &&
          'bg-gray-500/50 text-gray-200 hover:bg-gray-600/50'
        }
        ${
          team === PlayerTeam.RED &&
          'bg-red-500/50 text-red-200 hover:bg-red-600/50'
        }`}
      >
        {team === PlayerTeam.BLUE && 'Blue team'}
        {team === PlayerTeam.SPECTATOR && 'Spectator'}
        {team === PlayerTeam.RED && 'Red team'}
      </button>
      <div
        className="flex flex-1 flex-col gap-3 rounded-lg bg-black p-5"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropPlayer}
      >
        {[...playersToRender].map(([id, player]) => {
          return (
            <div
              key={id}
              draggable={socket.id === game.admin.id}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', id);
              }}
              className={`${
                socket.id === game.admin.id && 'cursor-grab'
              } rounded-lg border-2 border-zinc-900 p-1 px-4`}
            >
              {player.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TeamSelect = () => {
  return (
    <div className="mt-5 flex gap-5">
      <Team team={PlayerTeam.BLUE} />
      <Team team={PlayerTeam.SPECTATOR} />
      <Team team={PlayerTeam.RED} />
    </div>
  );
};

export default TeamSelect;
