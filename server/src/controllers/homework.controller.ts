import { Request, Response } from 'express';
import homeworkService from '../services/homework.service';
import requestService from '../services/request.service';
import { ok, fail } from '../middleware/error.middleware';
import config from '../config';

export async function confirmHomework(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user || user.role !== 'student') return fail(res, '仅学生可提交', 403);
    const { subject, homeworkDescription, parentRemark } = req.body;
    if (!subject || !homeworkDescription) return fail(res, '请填写科目和作业描述');
    const result = await requestService.submitRequest(
      user.id || user.userId!,
      'homework_confirm',
      {
        subject,
        homework_description: homeworkDescription,
        parent_remark: parentRemark,
      }
    );
    return ok(res, result, '已提交，等待老师审核');
  } catch (e: any) {
    return fail(res, e.message || '提交失败');
  }
}

export async function uploadHomework(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user || user.role !== 'student') return fail(res, '仅学生可上传', 403);
    const file = (req as any).file;
    if (!file) return fail(res, '请上传图片');
    const { subject, description } = req.body;
    if (!subject) return fail(res, '请填写科目');
    const imageUrl = `${config.upload.publicUrl}/${file.filename}`;
    const result = await homeworkService.uploadHomework(
      user.id || user.userId!,
      subject,
      imageUrl,
      description
    );
    return ok(res, result, '上传成功');
  } catch (e: any) {
    return fail(res, e.message || '上传失败');
  }
}

export async function setVisibility(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { isPublic, teacherNote } = req.body;
    if (isPublic === undefined || isPublic === null) return fail(res, '请指定 isPublic');
    const result = await homeworkService.setVisibility(
      id,
      isPublic ? 1 : 0,
      teacherNote
    );
    return ok(res, result, '更新成功');
  } catch (e: any) {
    return fail(res, e.message || '更新失败');
  }
}

export async function getPublicHomework(req: Request, res: Response) {
  try {
    const classId = Number(req.query.classId);
    const subject = req.query.subject as string | undefined;
    if (!classId) return fail(res, '请指定 classId');
    const result = await homeworkService.getPublicHomework(classId, subject);
    return ok(res, result);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export async function getMyHomework(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user || user.role !== 'student') return fail(res, '仅学生可查询', 403);
    const result = await homeworkService.getMyUploads(user.id || user.userId!);
    return ok(res, result);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export default {
  confirmHomework,
  uploadHomework,
  setVisibility,
  getPublicHomework,
  getMyHomework,
};
