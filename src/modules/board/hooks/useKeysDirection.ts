import { useEffect, useState } from 'react';

import { useGame } from '@/common/hooks/useGame';
import { usePeers } from '@/common/hooks/usePeers';
import { socket } from '@/common/libs/socket';
import { DataType, DirectionData } from '@/common/types/peer.type';
import type { Direction } from '@/common/types/player.type';

export const useKeysDirection = () => {
  const { adminPeer } = usePeers();
  const {
    game: { admin },
  } = useGame();

  const [direction, setDirection] = useState<Direction>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;

      switch (e.key) {
        case 'w':
        case 'W':
          setDirection((prev) => ({ ...prev, y: -1 }));
          break;
        case 's':
        case 'S':
          setDirection((prev) => ({ ...prev, y: 1 }));
          break;
        case 'a':
        case 'A':
          setDirection((prev) => ({ ...prev, x: -1 }));
          break;
        case 'd':
        case 'D':
          setDirection((prev) => ({ ...prev, x: 1 }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'w':
        case 'W':
          if (direction.y === -1) setDirection((prev) => ({ ...prev, y: 0 }));
          break;
        case 's':
        case 'S':
          if (direction.y === 1) setDirection((prev) => ({ ...prev, y: 0 }));
          break;
        case 'a':
        case 'A':
          if (direction.x === -1) setDirection((prev) => ({ ...prev, x: 0 }));
          break;
        case 'd':
        case 'D':
          if (direction.x === 1) setDirection((prev) => ({ ...prev, x: 0 }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [direction.x, direction.y]);

  useEffect(() => {
    if (admin.id !== socket.id) {
      if (adminPeer && adminPeer.connected) {
        adminPeer.send(
          JSON.stringify({
            type: DataType.DIRECTION,
            direction,
          } as DirectionData)
        );
      }
    }
  }, [admin.id, adminPeer, direction]);

  return direction;
};
