import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error('[Error]', err.message || err);
  const status = err.statusCode || err.status || 500;
  return res.status(status).json({
    code: status,
    message: err.message || '服务器内部错误',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ code: 404, message: '接口不存在' });
}

export function jsonResponse(data: any, message = 'success') {
  return { code: 200, message, data };
}

export function ok(res: Response, data: any = null, message = 'success') {
  return res.json({ code: 200, message, data });
}

export function fail(res: Response, message: string, code = 400) {
  return res.status(code).json({ code, message, data: null });
}
