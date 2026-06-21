import { Request, Response } from 'express';
import rankingService from '../services/ranking.service';
import { ok, fail } from '../middleware/error.middleware';

export async function getClassRanking(req: Request, res: Response) {
  try {
    const classId = Number(req.query.classId);
    const type = (req.query.type as any) || 'points';
    const period = (req.query.period as any) || 'all';
    if (!classId) return fail(res, '请指定 classId');
    const result = await rankingService.getClassRanking(classId, type, period);
    return ok(res, result);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export default { getClassRanking };
