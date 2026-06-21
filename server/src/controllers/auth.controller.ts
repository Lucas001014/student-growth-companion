import { Request, Response } from 'express';
import authService from '../services/auth.service';
import { ok, fail } from '../middleware/error.middleware';

export async function login(req: Request, res: Response) {
  try {
    const { phone, password, studentNo, classVerifyCode, role } = req.body;

    if (studentNo || role === 'student') {
      if (!studentNo || !classVerifyCode) {
        return fail(res, '请提供学号和班级验证码');
      }
      const result = await authService.studentLogin(studentNo, classVerifyCode);
      return ok(res, result, '登录成功');
    }

    if (!phone || !password) {
      return fail(res, '请提供手机号和密码');
    }

    if (role === 'admin') {
      const result = await authService.adminLogin(phone, password);
      return ok(res, result, '管理员登录成功');
    }

    const result = await authService.teacherLogin(phone, password);
    return ok(res, result, '登录成功');
  } catch (e: any) {
    return fail(res, e.message || '登录失败');
  }
}

export async function switchMode(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user || user.role !== 'student') {
      return fail(res, '仅学生可切换模式', 403);
    }
    const { mode, parentPassword, isNew } = req.body;
    if (!mode || (mode !== 'student' && mode !== 'parent')) {
      return fail(res, '模式参数错误');
    }
    const result = await authService.switchMode(user.id || user.userId!, mode, parentPassword);
    return ok(res, result, '切换成功');
  } catch (e: any) {
    return fail(res, e.message || '切换失败');
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user) return fail(res, '未登录', 401);
    const { oldPassword, newPassword } = req.body;
    if (!newPassword) return fail(res, '请输入新密码');
    const result = await authService.changePassword(
      user.id || user.userId!,
      oldPassword,
      newPassword,
      user.role as any
    );
    return ok(res, result, '修改成功');
  } catch (e: any) {
    return fail(res, e.message || '修改失败');
  }
}

export default { login, switchMode, changePassword };
