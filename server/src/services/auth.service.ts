import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Student, ClassModel } from '../models/index';
import config from '../config/index';

class AuthService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private signToken(payload: any): string {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
  }

  async teacherLogin(phone: string, password: string): Promise<any> {
    const user = await User.findOne({
      where: { phone, role: 'teacher', is_active: 1 },
      include: [{ model: ClassModel, as: 'classes', attributes: ['id', 'name', 'grade'] }],
    });
    if (!user) throw new Error('账号不存在或未激活');
    const ok = await this.comparePassword(password, user.password_hash);
    if (!ok) throw new Error('密码错误');
    const token = this.signToken({ userId: user.id, role: 'teacher', name: user.name });
    const plain = user.toJSON();
    delete plain.password_hash;
    return { token, user: plain };
  }

  async adminLogin(phone: string, password: string): Promise<any> {
    const user = await User.findOne({ where: { phone, role: 'admin', is_active: 1 } });
    if (!user) throw new Error('管理员账号不存在');
    const ok = await this.comparePassword(password, user.password_hash);
    if (!ok) throw new Error('密码错误');
    const token = this.signToken({ userId: user.id, role: 'admin', name: user.name });
    const plain = user.toJSON();
    delete plain.password_hash;
    return { token, user: plain };
  }

  async studentLogin(studentNo: string, classVerifyCode: string): Promise<any> {
    const student = await Student.findOne({
      where: { student_no: studentNo, is_deleted: 0 },
      include: [
        { model: ClassModel, as: 'class', attributes: ['id', 'name', 'grade'] },
      ],
    });
    if (!student) throw new Error('学号不存在');
    if (!student.class_verify_code || student.class_verify_code !== classVerifyCode) {
      throw new Error('班级验证码错误');
    }
    const token = this.signToken({
      userId: student.id,
      role: 'student',
      name: student.name,
      classId: student.class_id,
      mode: 'student',
    });
    const plain = student.toJSON();
    delete plain.parent_password;
    return { token, student: plain };
  }

  async switchMode(userId: number, mode: 'student' | 'parent', parentPassword?: string): Promise<any> {
    const student = await Student.findOne({ where: { id: userId, is_deleted: 0 } });
    if (!student) throw new Error('学生不存在');

    if (mode === 'parent') {
      if (!student.parent_password || student.parent_password === '') {
        if (!parentPassword) throw new Error('请设置家长密码');
        student.parent_password = await this.hashPassword(parentPassword);
        await student.save();
      } else {
        if (!parentPassword) throw new Error('请输入家长密码');
        const ok = await this.comparePassword(parentPassword, student.parent_password);
        if (!ok) throw new Error('家长密码错误');
      }
    }

    const token = this.signToken({
      userId: student.id,
      role: 'student',
      name: student.name,
      classId: student.class_id,
      mode,
    });
    return { token, mode };
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string, role: 'admin' | 'teacher' = 'teacher'): Promise<any> {
    if (role === 'student') {
      const student = await Student.findByPk(userId);
      if (!student) throw new Error('学生不存在');
      if (student.parent_password) {
        const ok = await this.comparePassword(oldPassword, student.parent_password);
        if (!ok) throw new Error('原密码错误');
      }
      student.parent_password = await this.hashPassword(newPassword);
      await student.save();
      return { success: true };
    }

    const user = await User.findByPk(userId);
    if (!user) throw new Error('用户不存在');
    const ok = await this.comparePassword(oldPassword, user.password_hash);
    if (!ok) throw new Error('原密码错误');
    user.password_hash = await this.hashPassword(newPassword);
    (user as any).must_change_password = 0;
    await user.save();
    return { success: true };
  }
}

export const authService = new AuthService();
export default authService;
