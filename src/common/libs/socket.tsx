import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

import type { ClientToServer, ServerToClient } from '../types/socket.type';

export const socket: Socket<ServerToClient, ClientToServer> = io();
