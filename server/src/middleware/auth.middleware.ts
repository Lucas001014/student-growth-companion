import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { JwtPayload } from '../types';

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || (req.headers['authorization'] as string) || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-token'] as string);
  if (!token) {
    return res.status(401).json({ code: 401, message: '未登录' });
  }
  try {
    const payload = jwt.verify(token, config.jwt.secret) as any;
    req.user = payload as JwtPayload;
    next();
  } catch {
    return res.status(401).json({ code: 401, message: '登录已过期或无效' });
  }
}

// 校验角色
export function requireRole(roles: Array<'admin' | 'teacher' | 'student'>) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.user) return res.status(401).json({ code: 401, message: '未登录' });
    if (!roles.includes(req.user.role as any)) {
      return res.status(403).json({ code: 403, message: '权限不足' });
    }
    next();
  };
}

// 家长模式校验 - 允许家长模式接口
export function allowParent(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ code: 401, message: '未登录' });
  if (req.user.mode !== 'parent') {
    return res.status(403).json({ code: 403, message: '请切换到家长模式' });
  }
  next();
}

// 学生模式校验 - 学生端的学生操作，禁止家长模式
export function requireStudentMode(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ code: 401, message: '未登录' });
  if (req.user.role === 'student' && req.user.mode === 'parent') {
    return res.status(403).json({ code: 403, message: '家长模式下不可操作，请切回学生模式' });
  }
  next();
}
