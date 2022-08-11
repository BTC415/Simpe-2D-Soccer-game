/* eslint-disable no-console */
import { Server, Socket } from 'socket.io';

import { Game } from '@/common/types/game.type';
import type { Direction } from '@/common/types/player.type';
import type {
  ClientToServer,
  ServerToClient,
} from '@/common/types/socket.type';

import { REAL_BOARD_SIZE, TICKRATE } from './constants/settings';
import { handlePlayersMovement } from './helpers/handlePlayersMovement';

type PlayerJoin = {
  socketId: string;
  name: string;
};

export class GameServer {
  private io: Server<ClientToServer, ServerToClient>;

  private games: Game[] = [];

  private gamesIntervals: Map<string, NodeJS.Timeout> = new Map();

  private sockets: Map<string, Socket<ClientToServer, ServerToClient>> =
    new Map();

  constructor(io: Server<ClientToServer, ServerToClient>) {
    this.io = io;

    this.io.on('connection', (socket) => {
      console.log('new connection');

      this.addSocket(socket);
    });
  }

  private addSocket(socket: Socket<ClientToServer, ServerToClient>) {
    this.sockets.set(socket.id, socket);
    this.setupSocket(socket);
  }

  private setupSocket(socket: Socket<ClientToServer, ServerToClient>) {
    socket.on('create_game', (name) =>
      this.createGame({ socketId: socket.id, name })
    );
    socket.on('join_game', (name, gameId) =>
      this.joinGame({ name, socketId: socket.id }, gameId)
    );
    socket.on('leave_game', () => this.leaveGame(socket.id));
    socket.on('change_direction', (direction) =>
      this.changeDirection(socket.id, direction)
    );
    socket.on('disconnecting', () => {
      this.leaveGame(socket.id);
      console.log('client disconnected');
    });
  }

  private changeDirection(socketId: string, direction: Direction) {
    const gameId = this.getGameIdConnectedTo(socketId);
    if (!gameId) return;

    const game = this.getGame(gameId);
    if (!game) return;

    const player = game.players.get(socketId);
    if (!player) return;

    game.players.set(socketId, {
      ...player,
      direction,
    });
  }

  private getGameIdConnectedTo(socketId: string): string | undefined {
    const socket = this.sockets.get(socketId);

    if (socket) {
      return [...socket.rooms.values()][1];
    }

    return undefined;
  }

  private getGame(gameId: string): Game | undefined {
    return this.games.find((game) => game.id === gameId);
  }

  private createGame({ socketId, name }: PlayerJoin) {
    let gameId = '';
    do {
      gameId = Math.random().toString(36).slice(2, 6);
    } while (this.getGame(gameId));

    this.games.push({
      id: gameId,
      players: new Map(),
    });

    this.setupGame(gameId);

    this.joinGame({ socketId, name }, gameId);
  }

  private joinGame({ socketId, name }: PlayerJoin, gameId: string) {
    const game = this.getGame(gameId);
    if (!game) {
      this.io.to(socketId).emit('game_not_found');
      return;
    }

    if (game.players.get(socketId)) return;

    this.addPlayerToGame({ socketId, name }, gameId);

    this.sockets.get(socketId)?.join(gameId);
    this.io.to(socketId).emit('game_joined', gameId);
  }

  private addPlayerToGame({ socketId, name }: PlayerJoin, gameId: string) {
    const game = this.getGame(gameId);
    if (!game) return;

    game.players.set(socketId, {
      id: socketId,
      name: !name ? `Player ${game.players.size + 1}` : name,
      position: {
        x: game.players.size % 2 === 1 ? REAL_BOARD_SIZE.width - 200 : 200,
        y: REAL_BOARD_SIZE.height / 2,
      },
      team: game.players.size % 2 === 1 ? 'red' : 'blue',
      direction: { x: 0, y: 0 },
      velocityVector: { x: 0, y: 0 },
    });
  }

  private leaveGame(socketId: string) {
    const gameId = this.getGameIdConnectedTo(socketId);
    if (!gameId) return;

    const game = this.getGame(gameId);
    if (!game) return;

    game.players.delete(socketId);

    if (game.players.size === 0) this.deleteGame(gameId);

    this.sockets.get(socketId)?.leave(gameId);
  }

  private deleteGame(gameId: string) {
    this.games = this.games.filter((game) => game.id !== gameId);

    const intervalId = this.gamesIntervals.get(gameId);
    if (intervalId) {
      clearInterval(intervalId);
      this.gamesIntervals.delete(gameId);
    }
  }

  private setupGame(gameId: string) {
    const game = this.getGame(gameId);
    if (!game) return;

    const interval = setInterval(() => {
      game.players = handlePlayersMovement(game.players);

      this.io
        .to(game.id)
        .emit('update', { id: gameId, players: [...game.players.values()] });
    }, 1000 / TICKRATE);

    this.gamesIntervals.set(gameId, interval);
  }
}
