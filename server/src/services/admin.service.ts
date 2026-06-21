import { Op } from 'sequelize';
import sequelize from '../config/database';
import {
  User,
  Student,
  ClassModel,
  TeacherClass,
  Skin,
  Title,
  IdentityBadge,
  PointsRecord,
} from '../models/index';
import bcrypt from 'bcryptjs';
import config from '../config/index';
import redis from '../config/redis';

let runtimeConfig: any = null;

class AdminService {
  async getDashboard(): Promise<any> {
    const [classCount, teacherCount, studentCount, honorCount] = await Promise.all([
      ClassModel.count(),
      User.count({ where: { role: 'teacher', is_active: 1 } }),
      Student.count({ where: { is_deleted: 0 } }),
      PointsRecord.count({ where: { amount: { [Op.gt]: 0 } } }),
    ]);
    return {
      class_count: classCount,
      teacher_count: teacherCount,
      student_count: studentCount,
      honor_count: honorCount,
    };
  }

  async createTeacher(data: {
    name: string;
    phone: string;
    password: string;
    classIds: number[];
  }): Promise<any> {
    const existing = await User.findOne({ where: { phone: data.phone } });
    if (existing) throw new Error('该手机号已注册');

    const tx = await sequelize.transaction();
    try {
      const user = await User.create(
        {
          name: data.name,
          phone: data.phone,
          password_hash: await bcrypt.hash(data.password, 10),
          role: 'teacher',
          is_active: 1,
          must_change_password: 1,
        },
        { transaction: tx }
      );
      for (const classId of data.classIds || []) {
        await TeacherClass.create(
          { teacher_id: user.id, class_id: classId },
          { transaction: tx }
        );
      }
      await tx.commit();
      const plain: any = user.toJSON();
      delete plain.password_hash;
      return plain;
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  }

  async getTeachers(): Promise<any[]> {
    const list = await User.findAll({
      where: { role: 'teacher' },
      include: [{ model: ClassModel, as: 'classes', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
    });
    return list.map((u) => {
      const p: any = u.toJSON();
      delete p.password_hash;
      return p;
    });
  }

  async getClassesWithStats(): Promise<any[]> {
    const classes = await ClassModel.findAll({
      include: [
        {
          model: User,
          as: 'teachers',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
        {
          model: Student,
          as: 'students',
          attributes: ['points'],
          where: { is_deleted: 0 },
          required: false,
        },
      ],
      order: [['id', 'ASC']],
    });
    return classes.map((c: any) => {
      const p = c.toJSON();
      const pts = (p.students || []).map((s: any) => s.points || 0);
      const avg = pts.length > 0 ? Math.round(pts.reduce((a: number, b: number) => a + b, 0) / pts.length) : 0;
      return {
        id: p.id,
        name: p.name,
        grade: p.grade,
        teachers: p.teachers,
        student_count: pts.length,
        points_avg: avg,
      };
    });
  }

  async createSkin(data: any): Promise<any> {
    return Skin.create({
      name: data.name,
      image_url: data.image_url,
      rarity: data.rarity || 'N',
      description: data.description,
      is_active: data.is_active ?? 1,
    });
  }
  async updateSkin(id: number, data: any): Promise<any> {
    const item = await Skin.findByPk(id);
    if (!item) throw new Error('皮肤不存在');
    return item.update(data);
  }
  async deleteSkin(id: number): Promise<any> {
    const item = await Skin.findByPk(id);
    if (!item) throw new Error('皮肤不存在');
    await item.destroy();
    return { success: true };
  }

  async createTitle(data: any): Promise<any> {
    return Title.create({
      name: data.name,
      color: data.color || '#333',
      icon: data.icon,
      description: data.description,
      is_active: data.is_active ?? 1,
    });
  }
  async updateTitle(id: number, data: any): Promise<any> {
    const item = await Title.findByPk(id);
    if (!item) throw new Error('称号不存在');
    return item.update(data);
  }
  async deleteTitle(id: number): Promise<any> {
    const item = await Title.findByPk(id);
    if (!item) throw new Error('称号不存在');
    await item.destroy();
    return { success: true };
  }

  async createIdentityBadge(data: any): Promise<any> {
    return IdentityBadge.create({
      name: data.name,
      icon: data.icon,
      description: data.description,
      is_active: data.is_active ?? 1,
    });
  }
  async updateIdentityBadge(id: number, data: any): Promise<any> {
    const item = await IdentityBadge.findByPk(id);
    if (!item) throw new Error('身份标识不存在');
    return item.update(data);
  }
  async deleteIdentityBadge(id: number): Promise<any> {
    const item = await IdentityBadge.findByPk(id);
    if (!item) throw new Error('身份标识不存在');
    await item.destroy();
    return { success: true };
  }

  getConfig(): any {
    if (runtimeConfig) return runtimeConfig;
    return {
      points: {
        max: config.points.max,
        homeworkConfirmReward: config.points.homeworkConfirmReward,
        blindboxDailyLimit: config.points.blindboxDailyLimit,
        approvalValidDays: config.points.approvalValidDays,
      },
    };
  }

  async updateConfig(pointsConfig: any): Promise<any> {
    runtimeConfig = { points: { ...this.getConfig().points, ...pointsConfig } };
    try {
      await redis.set('config:points', JSON.stringify(runtimeConfig.points), 3600);
    } catch {}
    return runtimeConfig;
  }

  async exportData(scope: 'students' | 'classes' | 'points' | 'teachers' = 'students'): Promise<string> {
    let rows: any[] = [];
    let headers: string[] = [];
    if (scope === 'students') {
      rows = await Student.findAll({ where: { is_deleted: 0 } });
      headers = ['id', 'student_no', 'name', 'class_id', 'points'];
    } else if (scope === 'classes') {
      rows = await ClassModel.findAll();
      headers = ['id', 'name', 'grade'];
    } else if (scope === 'teachers') {
      rows = await User.findAll({ where: { role: 'teacher' } });
      headers = ['id', 'name', 'phone', 'is_active'];
    } else if (scope === 'points') {
      rows = await PointsRecord.findAll({ order: [['created_at', 'DESC']], limit: 5000 });
      headers = ['id', 'student_id', 'amount', 'balance_after', 'source', 'category', 'remark', 'created_at'];
    }
    const esc = (v: any) => {
      if (v === null || v === undefined) return '';
      const s = String(v).replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    const lines = [headers.join(',')];
    for (const row of rows) {
      const p: any = row.toJSON ? row.toJSON() : row;
      lines.push(headers.map((h) => esc(p[h])).join(','));
    }
    return lines.join('\n');
  }
}

export const adminService = new AdminService();
export default adminService;
