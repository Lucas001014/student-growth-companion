import { Request, Response } from 'express';
import honorService from '../services/honor.service';
import { ok, fail } from '../middleware/error.middleware';

export async function grantPoints(req: Request, res: Response) {
  try {
    const user = req.user;
    const { studentIds, amount, category, remark } = req.body;
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return fail(res, '请指定学生');
    }
    if (!amount) return fail(res, '请指定积分');
    const result = await honorService.grantPoints(
      studentIds,
      Number(amount),
      category || 'general',
      remark || '',
      user?.id || user?.userId
    );
    return ok(res, result, '发放成功');
  } catch (e: any) {
    return fail(res, e.message || '发放失败');
  }
}

export async function grantSkin(req: Request, res: Response) {
  try {
    const user = req.user;
    const { studentId, skinId } = req.body;
    if (!studentId || !skinId) return fail(res, '参数缺失');
    const result = await honorService.grantSkin(
      Number(studentId),
      Number(skinId),
      user?.id || user?.userId
    );
    return ok(res, result, '发放成功');
  } catch (e: any) {
    return fail(res, e.message || '发放失败');
  }
}

export async function grantTitle(req: Request, res: Response) {
  try {
    const user = req.user;
    const { studentId, titleId, validUntil } = req.body;
    if (!studentId || !titleId) return fail(res, '参数缺失');
    const until = validUntil ? new Date(validUntil) : undefined;
    const result = await honorService.grantTitle(
      Number(studentId),
      Number(titleId),
      until,
      user?.id || user?.userId
    );
    return ok(res, result, '发放成功');
  } catch (e: any) {
    return fail(res, e.message || '发放失败');
  }
}

export async function getStudentHonor(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await honorService.getStudentHonor(id);
    return ok(res, result);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export default { grantPoints, grantSkin, grantTitle, getStudentHonor };
