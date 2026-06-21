import { Request, Response } from 'express';
import requestService from '../services/request.service';
import { ok, fail } from '../middleware/error.middleware';

export async function submitRequest(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user || user.role !== 'student') return fail(res, '仅学生可提交', 403);
    const { type, targetSkinId, targetTitleId, subject, homeworkDescription, reason } = req.body;
    if (!type) return fail(res, '请指定申请类型');
    const data: any = {
      target_skin_id: targetSkinId,
      target_title_id: targetTitleId,
      subject,
      homework_description: homeworkDescription,
      reason,
    };
    const result = await requestService.submitRequest(
      user.id || user.userId!,
      type,
      data
    );
    return ok(res, result, '提交成功');
  } catch (e: any) {
    return fail(res, e.message || '提交失败');
  }
}

export async function getRequestList(req: Request, res: Response) {
  try {
    const filter: any = {
      type: (req.query.type as string) || undefined,
      status: (req.query.status as string) || undefined,
      classId: req.query.classId ? Number(req.query.classId) : undefined,
    };
    const result = await requestService.getRequestList(filter);
    return ok(res, result);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export async function approveRequest(req: Request, res: Response) {
  try {
    const user = req.user;
    const id = Number(req.params.id);
    const { action, remark } = req.body;
    if (!action || (action !== 'approve' && action !== 'reject')) {
      return fail(res, '请指定 action 为 approve 或 reject');
    }
    const result = await requestService.approveRequest(
      id,
      action,
      remark,
      user?.id || user?.userId
    );
    return ok(res, result, '处理成功');
  } catch (e: any) {
    return fail(res, e.message || '处理失败');
  }
}

export default { submitRequest, getRequestList, approveRequest };
