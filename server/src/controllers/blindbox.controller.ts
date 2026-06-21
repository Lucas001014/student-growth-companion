import { Request, Response } from 'express';
import blindboxService from '../services/blindbox.service';
import { ok, fail } from '../middleware/error.middleware';

export async function createBlindBox(req: Request, res: Response) {
  try {
    const user = req.user;
    const { name, description, costPoints, dailyLimit, weeklyLimit, classId, items } = req.body;
    if (!name || costPoints === undefined || costPoints === null) {
      return fail(res, '请填写名称和消耗积分');
    }
    const result = await blindboxService.createBlindBox({
        name,
        description,
        costPoints: Number(costPoints),
        dailyLimit: dailyLimit !== undefined ? Number(dailyLimit) : undefined,
        weeklyLimit: weeklyLimit !== undefined ? Number(weeklyLimit) : undefined,
        classId: classId ? Number(classId) : undefined,
        createdBy: user?.id || user?.userId,
        items: items || [],
      });
    return ok(res, result, '创建成功');
  } catch (e: any) {
    return fail(res, e.message || '创建失败');
  }
}

export async function getAvailableBlindBoxes(req: Request, res: Response) {
  try {
    const user = req.user;
    const classId = user?.classId ? Number(user.classId) : undefined;
    const result = await blindboxService.getAvailableBlindBoxes(classId);
    return ok(res, result);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export async function drawBlindBox(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user || user.role !== 'student') return fail(res, '仅学生可抽取', 403);
    const { blindBoxId } = req.body;
    if (!blindBoxId) return fail(res, '请指定 blindBoxId');
    const result = await blindboxService.drawBlindBox(
      user.id || user.userId!,
      Number(blindBoxId)
    );
    return ok(res, result, '抽取成功');
  } catch (e: any) {
    return fail(res, e.message || '抽取失败');
  }
}

export async function updateBlindBox(req: Request, res: Response) {
  try {
    const user = req.user;
    const id = Number(req.params.id);
    const result = await blindboxService.updateBlindBox(id, req.body, user?.id || user?.userId!);
    return ok(res, result, '更新成功');
  } catch (e: any) {
    return fail(res, e.message || '更新失败');
  }
}

export default {
  createBlindBox,
  getAvailableBlindBoxes,
  drawBlindBox,
  updateBlindBox,
};
