import sequelize from '../config/database';
import {
  Student,
  PointsRecord,
  StudentSkin,
  StudentTitle,
  Skin,
  Title,
} from '../models/index';
import config from '../config/index';
import { socketService } from './screen.service';

class HonorService {
  async grantPoints(
    studentIds: number[],
    amount: number,
    category: string,
    remark: string,
    operatorId?: number
  ): Promise<any> {
    if (!studentIds || studentIds.length === 0) throw new Error('学生列表不能为空');
    const tx = await sequelize.transaction();
    const maxPoints = config.points.max;

    try {
      const results: any[] = [];
      for (const studentId of studentIds) {
        const student = await Student.findOne({
          where: { id: studentId, is_deleted: 0 },
          transaction: tx,
        });
        if (!student) continue;

        const current = student.points ?? 0;
        const next = Math.min(current + amount, maxPoints);
        const actual = next - current;
        await student.update({ points: next }, { transaction: tx });

        const record = await PointsRecord.create(
          {
            student_id: studentId,
            amount: actual,
            balance_after: next,
            source: 'teacher_grant',
            category,
            remark,
            operator_id: operatorId,
          },
          { transaction: tx }
        );
        results.push({ student, record });
      }

      await tx.commit();

      for (const item of results) {
        socketService.broadcastToClass(item.student.class_id, 'points_update', {
          studentId: item.student.id,
          amount,
          balanceAfter: item.student.points,
        });
        socketService.broadcastToClass(item.student.class_id, 'honor_event', {
          type: 'points',
          studentId: item.student.id,
          studentName: item.student.name,
          amount,
        });
        socketService.broadcastToClass(item.student.class_id, 'ranking_update', {
          studentId: item.student.id,
        });
      }

      return { updated: results.length, results };
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  }

  async grantSkin(studentId: number, skinId: number, operatorId?: number): Promise<any> {
    const student = await Student.findOne({ where: { id: studentId, is_deleted: 0 } });
    if (!student) throw new Error('学生不存在');
    const skin = await Skin.findByPk(skinId);
    if (!skin) throw new Error('皮肤不存在');

    const tx = await sequelize.transaction();
    try {
      await StudentSkin.update(
        { is_equipped: 0 },
        { where: { student_id: studentId }, transaction: tx }
      );
      let studentSkin = await StudentSkin.findOne({
        where: { student_id: studentId, skin_id: skinId },
        transaction: tx,
      });
      if (studentSkin) {
        await studentSkin.update({ is_equipped: 1 }, { transaction: tx });
      } else {
        studentSkin = await StudentSkin.create(
          {
            student_id: studentId,
            skin_id: skinId,
            is_equipped: 1,
            source: 'teacher_grant',
            granted_at: new Date(),
          },
          { transaction: tx }
        );
      }
      await tx.commit();

      socketService.broadcastToClass(student.class_id, 'honor_event', {
        type: 'skin',
        studentId: student.id,
        studentName: student.name,
        skinName: skin.name,
      });
      socketService.broadcastToClass(student.class_id, 'ranking_update', { studentId: student.id });

      return studentSkin;
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  }

  async grantTitle(studentId: number, titleId: number, validUntil?: Date, operatorId?: number): Promise<any> {
    const student = await Student.findOne({ where: { id: studentId, is_deleted: 0 } });
    if (!student) throw new Error('学生不存在');
    const title = await Title.findByPk(titleId);
    if (!title) throw new Error('称号不存在');

    const tx = await sequelize.transaction();
    try {
      await StudentTitle.update(
        { is_equipped: 0 },
        { where: { student_id: studentId }, transaction: tx }
      );
      let studentTitle = await StudentTitle.findOne({
        where: { student_id: studentId, title_id: titleId },
        transaction: tx,
      });
      if (studentTitle) {
        await studentTitle.update(
          { is_equipped: 1, valid_until: validUntil ?? studentTitle.valid_until },
          { transaction: tx }
        );
      } else {
        studentTitle = await StudentTitle.create(
          {
            student_id: studentId,
            title_id: titleId,
            is_equipped: 1,
            valid_until: validUntil,
            source: 'teacher_grant',
            granted_at: new Date(),
          },
          { transaction: tx }
        );
      }
      await tx.commit();

      socketService.broadcastToClass(student.class_id, 'honor_event', {
        type: 'title',
        studentId: student.id,
        studentName: student.name,
        titleName: title.name,
      });
      socketService.broadcastToClass(student.class_id, 'ranking_update', { studentId: student.id });

      return studentTitle;
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  }

  async getStudentHonor(studentId: number): Promise<any> {
    const student = await Student.findOne({
      where: { id: studentId, is_deleted: 0 },
      include: [
        {
          model: StudentSkin,
          as: 'skins',
          attributes: ['id', 'skin_id', 'is_equipped', 'source', 'granted_at'],
          include: [{ model: Skin, as: 'skin', attributes: ['id', 'name', 'image_url', 'rarity'] }],
        },
        {
          model: StudentTitle,
          as: 'titles',
          attributes: ['id', 'title_id', 'is_equipped', 'valid_until', 'source', 'granted_at'],
          include: [{ model: Title, as: 'title', attributes: ['id', 'name', 'color', 'icon'] }],
        },
      ],
    });
    if (!student) throw new Error('学生不存在');

    const pointsRecords = await PointsRecord.findAll({
      where: { student_id: studentId },
      order: [['created_at', 'DESC']],
      limit: 50,
    });

    const plain: any = student.toJSON();
    delete plain.parent_password;
    return { ...plain, points_records: pointsRecords };
  }
}

export const honorService = new HonorService();
export default honorService;
