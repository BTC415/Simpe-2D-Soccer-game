const Team = ({ team }: { team: 'blue' | 'spectator' | 'red' }) => {
  return (
    <div className="flex h-96 w-72 flex-col gap-3">
      <button
        className={`rounded-lg py-1 font-bold transition-colors
        ${
          team === 'blue' && 'bg-blue-500/50 text-blue-200 hover:bg-blue-600/50'
        }
        ${
          team === 'spectator' &&
          'bg-gray-500/50 text-gray-200 hover:bg-gray-600/50'
        }
        ${team === 'red' && 'bg-red-500/50 text-red-200 hover:bg-red-600/50'}`}
      >
        {team === 'blue' && 'Blue team'}
        {team === 'spectator' && 'Spectator'}
        {team === 'red' && 'Red team'}
      </button>
      <div className="flex-1 rounded-lg bg-black"></div>
    </div>
  );
};

const TeamSelect = () => {
  return (
    <div className="mt-5 flex gap-5">
      <Team team="blue" />
      <Team team="spectator" />
      <Team team="red" />
    </div>
  );
};

export default TeamSelect;
