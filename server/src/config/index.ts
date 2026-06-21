import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'class-honor-skin-secret-key-2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  mysql: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT) || 3306,
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'class_honor_skin',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxSize: 5 * 1024 * 1024,
    publicUrl: process.env.UPLOAD_PUBLIC_URL || '/uploads',
  },
  points: {
    max: 9999,
    homeworkConfirmReward: 10,
    blindboxDailyLimit: 3,
    approvalValidDays: 7,
  },
};

export default config;
