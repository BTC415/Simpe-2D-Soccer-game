/* eslint-disable no-console */
import { Server, Socket } from 'socket.io';

import type {
  ClientToServer,
  ServerToClient,
} from '@/common/types/socket.type';

type PlayerJoin = {
  socketId: string;
  name: string;
};

export class SocketServer {
  private io: Server<ClientToServer, ServerToClient>;

  private gamesAdmins: Map<string, string> = new Map();

  constructor(io: Server<ClientToServer, ServerToClient>) {
    this.io = io;

    this.io.on('connection', (socket) => {
      console.log('new connection');

      this.setupSocket(socket);
    });
  }

  private setupSocket(socket: Socket<ClientToServer, ServerToClient>) {
    socket.on('create_game', (name) =>
      this.createGame({ socketId: socket.id, name })
    );
    socket.on('join_game', (name, gameId) =>
      this.joinGame({ socketId: socket.id, name }, gameId)
    );
    socket.on('leave_game', () => this.leaveGame(socket.id));
    socket.on('disconnecting', () => this.leaveGame(socket.id));

    socket.on('signal_received', (signal, toPlayerId) =>
      this.signalPlayer({ fromPlayerId: socket.id, toPlayerId }, signal)
    );
  }

  private getGameIdConnectedTo(socketId: string): string | undefined {
    const socket = this.io.sockets.sockets.get(socketId);

    if (socket) {
      return [...socket.rooms.values()][1];
    }

    return undefined;
  }

  private getGameAdmin(gameId: string) {
    return this.gamesAdmins.get(gameId);
  }

  private getSocketById(
    socketId: string
  ): Socket<ClientToServer, ServerToClient> | undefined {
    return this.io.sockets.sockets.get(socketId);
  }

  private createGame({ socketId, name }: PlayerJoin) {
    let gameId = '';
    do {
      gameId = Math.random().toString(36).slice(2, 6);
    } while (this.getGameAdmin(gameId));

    this.gamesAdmins.set(gameId, socketId);
    this.joinGame({ socketId, name }, gameId);
  }

  private joinGame({ socketId, name }: PlayerJoin, gameId: string) {
    const gameAdmin = this.getGameAdmin(gameId);
    if (!gameAdmin) {
      this.io.to(socketId).emit('game_not_found');
      return;
    }

    const socket = this.getSocketById(socketId);
    if (socket) {
      socket.data.name = name;

      socket.join(gameId);
      this.io.to(socket.id).emit('game_joined', gameId, gameAdmin);

      if (gameAdmin !== socketId)
        this.io.to(gameAdmin).emit('player_joined', { id: socketId, name });
    }
  }

  private leaveGame(socketId: string) {
    const gameId = this.getGameIdConnectedTo(socketId);
    if (!gameId) return;

    const gameAdmin = this.getGameAdmin(gameId);
    if (!gameAdmin) return;

    this.getSocketById(socketId)?.leave(gameId);

    if (gameAdmin === socketId) {
      const room = this.io.sockets.adapter.rooms.get(gameId);
      if (room) {
        const newAdminId = [...room][0];

        if (newAdminId) {
          this.gamesAdmins.set(gameId, newAdminId);
          this.io.to(gameId).emit('admin_change', newAdminId);
        } else {
          this.gamesAdmins.delete(gameId);
        }
      } else {
        this.gamesAdmins.delete(gameId);
      }
    } else this.io.to(gameAdmin).emit('player_left', socketId);
  }

  private signalPlayer(
    { fromPlayerId, toPlayerId }: { fromPlayerId: string; toPlayerId: string },
    signal: any
  ) {
    console.log('signal received', fromPlayerId, toPlayerId);

    this.io.to(toPlayerId).emit('player_signal', signal, fromPlayerId);
  }
}
