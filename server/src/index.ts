import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import fs from 'fs';
import sequelize from './config/database';
import { socketService } from './services/screen.service';
import { auth } from './middleware/auth.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import classRoutes from './routes/class.routes';
import honorRoutes from './routes/honor.routes';
import requestRoutes from './routes/request.routes';
import homeworkRoutes from './routes/homework.routes';
import blindboxRoutes from './routes/blindbox.routes';
import rankingRoutes from './routes/ranking.routes';
import adminRoutes from './routes/admin.routes';
import config from './config';

export const app = express();
const server = http.createServer(app);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查
app.get('/health', (_req, res) => res.json({ code: 200, message: 'ok', data: { time: new Date().toISOString() } }));

// 静态文件
const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/class', auth, classRoutes);
app.use('/api/honor', auth, honorRoutes);
app.use('/api/request', auth, requestRoutes);
app.use('/api/homework', auth, homeworkRoutes);
app.use('/api/blindbox', auth, blindboxRoutes);
app.use('/api/ranking', auth, rankingRoutes);
app.use('/api/admin', auth, adminRoutes);

// 404 / 错误处理
app.use(notFoundHandler);
app.use(errorHandler);

// Socket.IO
socketService.attach(server, '*');

// 本地开发环境启动
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = config.port || 3000;

  async function bootstrap() {
    try {
      await sequelize.authenticate();
      console.log('[MySQL] 连接成功');
    } catch (err) {
      console.warn('[MySQL] 连接警告（将在首次同步时重试）:', (err as Error).message);
    }
    server.listen(PORT, () => {
      console.log(`[Server] 运行在 http://localhost:${PORT}`);
      console.log(`[Server] API 文档: POST /api/auth/login`);
      console.log(`[Server] 健康检查: GET /health`);
    });
  }

  bootstrap();
}

export default app;
