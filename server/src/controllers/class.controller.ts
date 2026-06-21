import { Request, Response } from 'express';
import classService from '../services/class.service';
import { ok, fail } from '../middleware/error.middleware';

export async function getStudents(req: Request, res: Response) {
  try {
    const user = req.user;
    let classId = Number(req.query.classId);

    if (user?.role === 'teacher') {
      const classes = await classService.getTeacherClasses(user.id || user.userId!);
      if (!classId) {
        if (classes.length === 0) return ok(res, [], '无班级');
        classId = classes[0].id;
      } else {
        const found = classes.find((c: any) => c.id === classId);
        if (!found) return fail(res, '无权操作该班级', 403);
      }
    } else if (user?.role === 'admin') {
      if (!classId) return fail(res, '请指定 classId');
    } else {
      return fail(res, '权限不足', 403);
    }

    const students = await classService.getClassStudents(classId);
    return ok(res, students);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export async function createStudent(req: Request, res: Response) {
  try {
    const user = req.user;
    const { classId, studentNo, name, avatar, points, identities } = req.body;
    if (!classId || !studentNo || !name) return fail(res, '参数缺失');

    const created = await classService.createStudent(classId, {
      student_no: studentNo,
      name,
      avatar,
      points,
    });

    if (identities && Array.isArray(identities) && identities.length > 0) {
      await classService.setStudentIdentity(created.id, identities);
    }

    return ok(res, created, '添加成功');
  } catch (e: any) {
    return fail(res, e.message || '添加失败');
  }
}

export async function batchImportStudents(req: Request, res: Response) {
  try {
    const { classId, students } = req.body;
    if (!classId || !Array.isArray(students)) return fail(res, '参数缺失');
    const normalized = students.map((s: any) => ({
      student_no: s.studentNo || s.student_no,
      name: s.name,
      avatar: s.avatar,
      points: s.points,
    }));
    const result = await classService.batchImportStudents(classId, normalized);
    return ok(res, result, '导入完成');
  } catch (e: any) {
    return fail(res, e.message || '导入失败');
  }
}

export async function updateStudent(req: Request, res: Response) {
  try {
    const user = req.user;
    const id = Number(req.params.id);
    const { studentNo, name, avatar, points } = req.body;
    const teacherId = user?.role === 'teacher' ? user.id || user.userId! : undefined;
    const result = await classService.updateStudent(id, {
      student_no: studentNo,
      name,
      avatar,
      points,
    }, teacherId);
    return ok(res, result, '更新成功');
  } catch (e: any) {
    return fail(res, e.message || '更新失败');
  }
}

export async function deleteStudent(req: Request, res: Response) {
  try {
    const user = req.user;
    const id = Number(req.params.id);
    const teacherId = user?.role === 'teacher' ? user.id || user.userId! : undefined;
    const result = await classService.deleteStudent(id, teacherId);
    return ok(res, result, '删除成功');
  } catch (e: any) {
    return fail(res, e.message || '删除失败');
  }
}

export async function setStudentIdentity(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const { badgeIds } = req.body;
    if (!Array.isArray(badgeIds)) return fail(res, 'badgeIds 必须为数组');
    const result = await classService.setStudentIdentity(id, badgeIds);
    return ok(res, result, '更新成功');
  } catch (e: any) {
    return fail(res, e.message || '更新失败');
  }
}

export default {
  getStudents,
  createStudent,
  batchImportStudents,
  updateStudent,
  deleteStudent,
  setStudentIdentity,
};
