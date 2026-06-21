import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';

type EventType = 'honor_event' | 'blindbox_event' | 'ranking_update' | 'announcement' | 'points_update';

class SocketService {
  private io: SocketIOServer | null = null;

  attach(httpServer: HTTPServer, corsOrigin = '*') {
    if (this.io) return this.io;
    this.io = new SocketIOServer(httpServer, {
      cors: { origin: corsOrigin, methods: ['GET', 'POST'] },
    });
    this.io.on('connection', (socket: Socket) => {
      const { classId, deviceCode, userId, role } = socket.handshake.query;
      if (classId) socket.join(`class:${classId}`);
      if (userId) socket.join(`user:${userId}`);
      if (deviceCode) socket.join(`device:${deviceCode}`);
      console.log(`[Socket] 连接: role=${role} class=${classId} user=${userId} device=${deviceCode} socketId=${socket.id}`);
      socket.on('disconnect', () => {
        console.log(`[Socket] 断开: ${socket.id}`);
      });
    });
    return this.io;
  }

  getIO(): SocketIOServer {
    return this.io!;
  }

  broadcast(event: EventType, payload: any, room?: string) {
    if (!this.io) return;
    if (room) this.io.to(room).emit(event, payload);
    else this.io.emit(event, payload);
  }

  broadcastToClass(classId: number | string, event: EventType, payload: any) {
    this.broadcast(event, payload, `class:${classId}`);
  }

  broadcastToUser(userId: number | string, event: EventType, payload: any) {
    this.broadcast(event, payload, `user:${userId}`);
  }

  broadcastToScreen(classId: number | string, event: EventType, payload: any) {
    this.broadcastToClass(classId, event, payload);
  }
}

export const socketService = new SocketService();
export default socketService;
