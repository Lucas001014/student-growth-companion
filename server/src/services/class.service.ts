import sequelize from '../config/database';
import {
  Student,
  ClassModel,
  TeacherClass,
  User,
  IdentityBadge,
  StudentIdentity,
  StudentSkin,
  StudentTitle,
  Skin,
  Title,
} from '../models/index';
import { socketService } from './screen.service';

class ClassService {
  async getTeacherClasses(teacherId: number): Promise<any[]> {
    const user = await User.findByPk(teacherId);
    if (!user) throw new Error('教师不存在');
    const classes = await ClassModel.findAll({
      include: [
        {
          model: User,
          as: 'teachers',
          where: { id: teacherId },
          attributes: [],
          through: { attributes: [] },
        },
      ],
      attributes: ['id', 'name', 'grade'],
      order: [['id', 'ASC']],
    });
    return classes;
  }

  async getClassInfo(classId: number): Promise<any> {
    const cls = await ClassModel.findByPk(classId, {
      include: [{ model: User, as: 'teachers', attributes: ['id', 'name', 'phone'] }],
    });
    if (!cls) throw new Error('班级不存在');
    const studentCount = await Student.count({ where: { class_id: classId, is_deleted: 0 } });
    return { ...cls.toJSON(), student_count: studentCount };
  }

  async getClassStudents(classId: number): Promise<any[]> {
    const students = await Student.findAll({
      where: { class_id: classId, is_deleted: 0 },
      include: [
        {
          model: IdentityBadge,
          as: 'identities',
          attributes: ['id', 'name', 'icon'],
          through: { attributes: [] },
        },
        {
          model: StudentSkin,
          as: 'equipped_skin',
          attributes: ['skin_id', 'is_equipped'],
          include: [{ model: Skin, as: 'skin', attributes: ['id', 'name', 'image_url'] }],
        },
        {
          model: StudentTitle,
          as: 'equipped_title',
          attributes: ['title_id', 'is_equipped'],
          include: [{ model: Title, as: 'title', attributes: ['id', 'name', 'color'] }],
        },
      ],
      order: [['points', 'DESC'], ['student_no', 'ASC']],
    });
    return students.map((s) => {
      const plain: any = s.toJSON();
      delete plain.parent_password;
      return plain;
    });
  }

  async createStudent(classId: number, data: any): Promise<any> {
    const cls = await ClassModel.findByPk(classId);
    if (!cls) throw new Error('班级不存在');

    const existing = await Student.findOne({
      where: { student_no: data.student_no, is_deleted: 0 },
    });
    if (existing) throw new Error('学号已存在');

    const student = await Student.create({
      student_no: data.student_no,
      name: data.name,
      class_id: classId,
      avatar: data.avatar || '/default_avatar.png',
      points: data.points ?? 0,
      parent_password: data.parent_password || '',
      class_verify_code: `C${classId}`,
    });
    return student;
  }

  async batchImportStudents(classId: number, students: any[]): Promise<any> {
    const cls = await ClassModel.findByPk(classId);
    if (!cls) throw new Error('班级不存在');

    const results: { success: any[]; failed: any[] } = { success: [], failed: [] };
    const tx = await sequelize.transaction();

    try {
      for (const item of students) {
        try {
          const existing = await Student.findOne({
            where: { student_no: item.student_no, is_deleted: 0 },
            transaction: tx,
          });
          if (existing) {
            results.failed.push({ ...item, reason: '学号已存在' });
            continue;
          }
          const student = await Student.create(
            {
              student_no: item.student_no,
              name: item.name,
              class_id: classId,
              avatar: item.avatar || '/default_avatar.png',
              points: item.points ?? 0,
              parent_password: item.parent_password || '',
              class_verify_code: `C${classId}`,
            },
            { transaction: tx }
          );
          results.success.push(student);
        } catch (e: any) {
          results.failed.push({ ...item, reason: e.message });
        }
      }
      await tx.commit();
      return results;
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  }

  private async checkTeacherOwnClass(teacherId: number, classId: number): Promise<void> {
    const rel = await TeacherClass.findOne({ where: { teacher_id: teacherId, class_id: classId } });
    if (!rel) throw new Error('无权操作该班级的学生');
  }

  async updateStudent(studentId: number, data: any, teacherId?: number): Promise<any> {
    const student = await Student.findOne({ where: { id: studentId, is_deleted: 0 } });
    if (!student) throw new Error('学生不存在');
    if (teacherId) await this.checkTeacherOwnClass(teacherId, student.class_id);

    if (data.student_no && data.student_no !== student.student_no) {
      const existing = await Student.findOne({ where: { student_no: data.student_no, is_deleted: 0 } });
      if (existing) throw new Error('学号已存在');
    }

    await student.update({
      student_no: data.student_no ?? student.student_no,
      name: data.name ?? student.name,
      avatar: data.avatar ?? student.avatar,
      points: data.points ?? student.points,
    });
    return student;
  }

  async deleteStudent(studentId: number, teacherId?: number): Promise<any> {
    const student = await Student.findOne({ where: { id: studentId, is_deleted: 0 } });
    if (!student) throw new Error('学生不存在');
    if (teacherId) await this.checkTeacherOwnClass(teacherId, student.class_id);
    await student.update({ is_deleted: 1 });
    return { success: true };
  }

  async setStudentIdentity(studentId: number, badgeIds: number[]): Promise<any> {
    const student = await Student.findOne({ where: { id: studentId, is_deleted: 0 } });
    if (!student) throw new Error('学生不存在');

    const tx = await sequelize.transaction();
    try {
      await StudentIdentity.destroy({ where: { student_id: studentId }, transaction: tx });
      const valid = badgeIds.filter((id) => id && id > 0);
      for (const badgeId of valid) {
        const badge = await IdentityBadge.findByPk(badgeId, { transaction: tx });
        if (!badge) continue;
        await StudentIdentity.create({ student_id: studentId, badge_id: badgeId }, { transaction: tx });
      }
      await tx.commit();
      socketService.broadcastToClass(student.class_id, 'ranking_update', { studentId });
      return { success: true };
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  }
}

export const classService = new ClassService();
export default classService;
