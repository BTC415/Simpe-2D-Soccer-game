/* eslint-disable no-console */
import { createServer } from 'http';

import express from 'express';
import next, { NextApiHandler } from 'next';
import { Server } from 'socket.io';

import type {
  ClientToServer,
  ServerToClient,
} from '@/common/types/socket.type';

import { GameServer } from './GameServer';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = express();
  const server = createServer(app);

  // eslint-disable-next-line no-new
  new GameServer(new Server<ClientToServer, ServerToClient>(server));

  app.all('*', (req: any, res: any) => nextHandler(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
