import { Op } from 'sequelize';
import sequelize from '../config/database';
import {
  Request as RequestModel,
  Student,
  StudentSkin,
  StudentTitle,
  PointsRecord,
  ClassModel,
} from '../models/index';
import config from '../config/index';
import { socketService } from './screen.service';

class RequestService {
  async submitRequest(
    studentId: number,
    type: 'skin_change' | 'title_change' | 'homework_confirm',
    data: any
  ): Promise<any> {
    const student = await Student.findOne({ where: { id: studentId, is_deleted: 0 } });
    if (!student) throw new Error('学生不存在');

    const payload: any = {
      student_id: studentId,
      type,
      status: 'pending',
      reason: data.reason,
      parent_remark: data.parent_remark,
    };

    if (type === 'skin_change') {
      if (!data.target_skin_id) throw new Error('请选择皮肤');
      payload.target_skin_id = data.target_skin_id;
    } else if (type === 'title_change') {
      if (!data.target_title_id) throw new Error('请选择称号');
      payload.target_title_id = data.target_title_id;
    } else if (type === 'homework_confirm') {
      payload.subject = data.subject;
      payload.homework_description = data.homework_description;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (config.points.approvalValidDays || 7));
      payload.expires_at = expiresAt;
    }

    const req = await RequestModel.create(payload);
    socketService.broadcastToClass(student.class_id, 'honor_event', {
      type: 'request_submitted',
      studentId,
      requestType: type,
      requestId: req.id,
    });
    return req;
  }

  async getRequestList(filter: { type?: string; status?: string; classId?: number } = {}): Promise<any[]> {
    const where: any = {};
    if (filter.type) where.type = filter.type;
    if (filter.status) where.status = filter.status;

    const reqs = await RequestModel.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'student_no', 'name', 'class_id'],
          include: filter.classId
            ? [{ model: ClassModel, as: 'class', attributes: [], where: { id: filter.classId } }]
            : [],
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 200,
    });
    return reqs;
  }

  async approveRequest(
    requestId: number,
    action: 'approve' | 'reject',
    reviewRemark?: string,
    operatorId?: number
  ): Promise<any> {
    const req = await RequestModel.findByPk(requestId);
    if (!req) throw new Error('申请不存在');
    if (req.status !== 'pending') throw new Error('该申请已处理');

    const student = await Student.findOne({ where: { id: req.student_id, is_deleted: 0 } });
    if (!student) throw new Error('学生不存在');

    const tx = await sequelize.transaction();
    try {
      if (action === 'approve') {
        if (req.type === 'skin_change' && req.target_skin_id) {
          await StudentSkin.update(
            { is_equipped: 0 },
            { where: { student_id: student.id }, transaction: tx }
          );
          let ss = await StudentSkin.findOne({
            where: { student_id: student.id, skin_id: req.target_skin_id },
            transaction: tx,
          });
          if (ss) {
            await ss.update({ is_equipped: 1 }, { transaction: tx });
          } else {
            await StudentSkin.create(
              { student_id: student.id, skin_id: req.target_skin_id!, is_equipped: 1, source: 'request', granted_at: new Date() },
              { transaction: tx }
            );
          }
        } else if (req.type === 'title_change' && req.target_title_id) {
          await StudentTitle.update(
            { is_equipped: 0 },
            { where: { student_id: student.id }, transaction: tx }
          );
          let st = await StudentTitle.findOne({
            where: { student_id: student.id, title_id: req.target_title_id },
            transaction: tx,
          });
          if (st) {
            await st.update({ is_equipped: 1 }, { transaction: tx });
          } else {
            await StudentTitle.create(
              { student_id: student.id, title_id: req.target_title_id!, is_equipped: 1, source: 'request', granted_at: new Date() },
              { transaction: tx }
            );
          }
        } else if (req.type === 'homework_confirm') {
          const reward = config.points.homeworkConfirmReward || 10;
          const maxPoints = config.points.max;
          const current = student.points ?? 0;
          const next = Math.min(current + reward, maxPoints);
          await student.update({ points: next }, { transaction: tx });
          await PointsRecord.create(
            {
              student_id: student.id,
              amount: next - current,
              balance_after: next,
              source: 'homework_confirm',
              category: req.subject || 'homework',
              remark: '作业确认奖励',
              operator_id: operatorId,
            },
            { transaction: tx }
          );
          await req.update({ reward_points: reward }, { transaction: tx });
        }

        await req.update(
          { status: 'approved', reviewed_by: operatorId, review_remark: reviewRemark, reviewed_at: new Date() },
          { transaction: tx }
        );
      } else {
        await req.update(
          { status: 'rejected', reviewed_by: operatorId, review_remark: reviewRemark, reviewed_at: new Date() },
          { transaction: tx }
        );
      }

      await tx.commit();

      socketService.broadcastToClass(student.class_id, 'honor_event', {
        type: action === 'approve' ? 'request_approved' : 'request_rejected',
        studentId: student.id,
        requestId: req.id,
        requestType: req.type,
      });
      if (action === 'approve') {
        socketService.broadcastToClass(student.class_id, 'ranking_update', { studentId: student.id });
      }

      return req;
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  }
}

export const requestService = new RequestService();
export default requestService;
