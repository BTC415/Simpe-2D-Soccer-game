import { useEffect, useRef, useState } from 'react';

import { PLAYER_SIZE, REAL_BOARD_SIZE } from '@/common/constants/settings';
import { useGame } from '@/common/hooks/useGame';
import { usePeers } from '@/common/hooks/usePeers';
import { decoder } from '@/common/libs/decoder';
import { socket } from '@/common/libs/socket';
import {
  Data,
  DataType,
  GameData,
  PositionData,
} from '@/common/types/peer.type';
import { PlayerTeam } from '@/common/types/player.type';

import { useAdminGame } from '../hooks/useAdminGame';
import { useCamera } from '../hooks/useCamera';
import { useKeysDirection } from '../hooks/useKeysDirection';
import { usePeersConnect } from '../hooks/usePeersConnect';

const Players = () => {
  const { setPosition, camX, camY, position } = useCamera();
  const { game, setGame } = useGame();
  const { admin } = game;
  const { adminPeer } = usePeers();

  const ref = useRef<HTMLCanvasElement>(null);

  const [playersPositions, setPlayersPositions] = useState<{
    [key: string]: [number, number];
  }>({});

  const direction = useKeysDirection();

  const names = usePeersConnect();
  const [adminPlayersPositions, adminPlayers] = useAdminGame(names, direction);

  useEffect(() => {
    if (admin.id !== socket.id) {
      if (adminPeer) {
        adminPeer.on('data', (data: Uint8Array) => {
          const parsedData = JSON.parse(decoder.decode(data)) as Data;

          if (parsedData.type === DataType.POSITIONS)
            setPlayersPositions((parsedData as PositionData).positions);

          if (parsedData.type === DataType.GAME) {
            const gameFromAdmin = (parsedData as GameData).game;
            setGame({
              ...gameFromAdmin,
              players: new Map(gameFromAdmin.players),
            });
          }
        });
      }

      return () => {
        if (adminPeer) {
          adminPeer.removeAllListeners('data');
        }
      };
    }

    return () => {};
  }, [admin.id, adminPeer, setGame]);

  const finalPlayersPositions =
    admin.id === socket.id ? adminPlayersPositions : playersPositions;

  const finalPlayers = admin.id === socket.id ? adminPlayers : game.players;

  useEffect(() => {
    const myPosition = finalPlayersPositions[socket.id];
    if (
      myPosition &&
      (myPosition[0] !== position.x || myPosition[1] !== position.y)
    )
      setPosition({ x: myPosition[0], y: myPosition[1] });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalPlayersPositions]);

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
      ctx.font = `bold ${PLAYER_SIZE / 1.9}px Montserrat`;
      ctx.textAlign = 'center';

      finalPlayers.forEach(({ team }, id) => {
        if (!finalPlayersPositions[id] || team === PlayerTeam.SPECTATOR) return;
        const [x, y] = finalPlayersPositions[id];

        ctx.fillStyle = team === PlayerTeam.BLUE ? '#3b82f6' : '#ef4444';

        ctx.beginPath();
        ctx.arc(x, y, PLAYER_SIZE, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      });

      ctx.fillStyle = '#fff';
      finalPlayers.forEach(({ name, team }, id) => {
        if (!finalPlayersPositions[id] || team === PlayerTeam.SPECTATOR) return;
        const [x, y] = finalPlayersPositions[id];

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
