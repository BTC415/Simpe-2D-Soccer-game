import { useEffect, useRef, useState } from 'react';

import { PLAYER_SIZE, REAL_BOARD_SIZE } from '@/common/constants/settings';
import { useAdmin } from '@/common/hooks/useAdmin';
import { socket } from '@/common/libs/socket';
import type { Data, DirectionData, UpdateData } from '@/common/types/peer.type';
import type { Player } from '@/common/types/player.type';

import { useAdminGame } from '../hooks/useAdminGame';
import { useCamera } from '../hooks/useCamera';
import { useKeysDirection } from '../hooks/useKeysDirection';
import { usePeers } from '../hooks/usePeers';

const Players = () => {
  const { setPosition, camX, camY } = useCamera();
  const { admin } = useAdmin();

  const ref = useRef<HTMLCanvasElement>(null);

  const [players, setPlayers] = useState<Map<string, Player>>(new Map());

  const direction = useKeysDirection();

  const { peers, names } = usePeers();
  const adminPlayers = useAdminGame({ peers, names }, direction);

  useEffect(() => {
    if (admin.id !== socket.id) {
      const adminPeer = peers.get(admin.id);

      if (adminPeer) {
        adminPeer.on('data', (data: string) => {
          const parsedData = JSON.parse(data) as Data;

          if (parsedData.type === 'update')
            setPlayers(new Map((parsedData as UpdateData).players));
        });
      }

      return () => {
        if (adminPeer) {
          adminPeer.removeAllListeners('data');
        }
      };
    }

    return () => {};
  }, [admin.id, peers]);

  useEffect(() => {
    if (admin.id !== socket.id) {
      const adminPeer = peers.get(admin.id);

      if (adminPeer && adminPeer.connected) {
        adminPeer.send(
          JSON.stringify({
            type: 'direction',
            direction,
          } as DirectionData)
        );
      }
    }
  }, [admin.id, direction, peers]);

  const finalPlayers = admin.id === socket.id ? adminPlayers : players;

  useEffect(() => {
    const myPosition = finalPlayers.get(socket.id)?.position;
    if (myPosition) setPosition(myPosition);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalPlayers]);

  if (ref.current) {
    const ctx = ref.current.getContext('2d');
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(
        0,
        0,
        REAL_BOARD_SIZE.width + PLAYER_SIZE * 2,
        REAL_BOARD_SIZE.height + PLAYER_SIZE
      );

      ctx.translate(camX, camY);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#000';

      finalPlayers.forEach(({ position: { x, y }, team }) => {
        ctx.fillStyle = team === 'blue' ? '#3b82f6' : '#ef4444';

        ctx.beginPath();
        ctx.arc(x, y, PLAYER_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      });

      ctx.font = `bold ${PLAYER_SIZE / 1.9}px Montserrat`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      finalPlayers.forEach(({ position: { x, y }, name }) => {
        ctx.fillText(name, x, y + PLAYER_SIZE + 20);
      });
    }
  }

  return (
    <canvas
      ref={ref}
      width={REAL_BOARD_SIZE.width}
      height={REAL_BOARD_SIZE.height}
      className="absolute z-10"
    />
  );
};

export default Players;
