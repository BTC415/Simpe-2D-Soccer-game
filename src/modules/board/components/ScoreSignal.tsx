import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

import { useGame } from '@/common/hooks/useGame';
import { PlayerTeam } from '@/common/types/player.type';

const ScoreSignal = () => {
  const { game, prevGame } = useGame();

  const [showTeam, setShowTeam] = useState<PlayerTeam>();

  useEffect(() => {
    if (!prevGame.id) return;

    if (game.scores[0] > prevGame.scores[0]) setShowTeam(PlayerTeam.BLUE);
    else if (game.scores[1] > prevGame.scores[1]) setShowTeam(PlayerTeam.RED);
  }, [game.scores, prevGame.id, prevGame.scores]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTeam(undefined);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [showTeam]);

  return (
    <AnimatePresence>
      {showTeam !== undefined && (
        <motion.div
          className="absolute z-20 flex h-full w-full items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.p
            className={`text-6xl font-black ${
              showTeam === PlayerTeam.BLUE && 'text-blue-500'
            } ${showTeam === PlayerTeam.RED && 'text-red-500'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
          >
            {showTeam === PlayerTeam.BLUE && 'BLUE SCORES'}
            {showTeam === PlayerTeam.RED && 'RED SCORES'}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScoreSignal;
