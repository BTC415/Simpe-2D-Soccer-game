/* eslint-disable no-console */
import { createServer } from 'http';

import express from 'express';
import next, { NextApiHandler } from 'next';
import { Server } from 'socket.io';

import type { ClientToServer, ServerToClient } from '@/common/libs/socket';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

const games: string[] = [];

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);

  const io = new Server<ClientToServer, ServerToClient>(server);

  io.on('connection', (socket) => {
    console.log('new connection');

    socket.on('create_game', () => {
      let gameId = '';
      do {
        gameId = Math.random().toString(36).slice(2, 6);
      } while (games.includes(gameId));

      games.push(gameId);
      socket.join(gameId);
      socket.emit('game_created', gameId);
    });

    socket.on('disconnecting', () => {
      console.log('client disconnected');
    });
  });

  app.all('*', (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
