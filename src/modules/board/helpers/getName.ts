import { Game } from '@/common/types/game.type';

export const getName = (
  id: string,
  { game, names }: { game: Game; names: Map<string, string> },
  prevName?: string
) => {
  if (prevName) return { name: prevName, newIndex: -1 };

  let newIndex = 0;
  do {
    newIndex += 1;
  } while (
    [...game.players.values()].some(
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      (player) => player.index === newIndex
    )
  );

  const name = names.get(id) || `Player ${newIndex}`;

  return { name, newIndex };
};
