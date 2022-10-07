import { useEffect, useState } from 'react';

import { useGame } from '@/common/hooks/useGame';
import { usePeers } from '@/common/hooks/usePeers';
import { socket } from '@/common/libs/socket';
import { DataType, ShootData } from '@/common/types/peer.type';

export const useShoot = () => {
  const { adminPeer } = usePeers();
  const {
    game: { admin },
  } = useGame();

  const [shoot, setShoot] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;

      if (!shoot) setShoot(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      setShoot(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shoot]);

  useEffect(() => {
    if (admin.id !== socket.id) {
      if (adminPeer && adminPeer.connected) {
        adminPeer.send(
          JSON.stringify({
            type: DataType.SHOOT,
            shoot,
          } as ShootData)
        );
      }
    }
  }, [admin.id, adminPeer, shoot]);

  return shoot;
};
