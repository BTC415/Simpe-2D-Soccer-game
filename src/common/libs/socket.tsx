import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export interface ClientToServer {
  create_game: (name: string) => void;
}

export interface ServerToClient {
  game_created: (gameId: string) => void;
}

export const socket: Socket<ServerToClient, ClientToServer> = io();
