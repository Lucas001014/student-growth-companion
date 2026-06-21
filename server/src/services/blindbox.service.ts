import { Op } from 'sequelize';
import sequelize from '../config/database';
import {
  BlindBox,
  BlindBoxItem,
  BlindBoxDraw,
  Student,
  StudentSkin,
  StudentTitle,
  PointsRecord,
  Skin,
  Title,
} from '../models/index';
import config from '../config/index';
import redis from '../config/redis';
import { socketService } from './screen.service';

class BlindBoxService {
  async createBlindBox(data: {
    name: string;
    description?: string;
    costPoints: number;
    dailyLimit?: number;
    weeklyLimit?: number;
    classId?: number;
    createdBy?: number;
    items: any[];
  }): Promise<any> {
    const items = data.items || [];
    let sum = 0;
    for (const it of items) sum += Number(it.probability) || 0;
    if (Math.abs(sum - 100) > 0.01) throw new Error('概率之和必须为100%');

    const tx = await sequelize.transaction();
    try {
      const box = await BlindBox.create(
        {
          name: data.name,
          description: data.description,
          cost_points: data.costPoints,
          daily_limit: data.dailyLimit ?? config.points.blindboxDailyLimit,
          weekly_limit: data.weeklyLimit,
          class_id: data.classId,
          is_active: 1,
          created_by: data.createdBy,
        },
        { transaction: tx }
      );
      for (const it of items) {
        await BlindBoxItem.create(
          {
            blind_box_id: box.id,
            item_type: it.type,
            item_id: it.itemId,
            points_amount: it.pointsAmount,
            probability: it.probability,
          },
          { transaction: tx }
        );
      }
      await tx.commit();
      return box;
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  }

  async getAvailableBlindBoxes(classId?: number): Promise<any[]> {
    const where: any = { is_active: 1 };
    if (classId) {
      where.class_id = [classId, null] as any;
    }
    const boxes = await BlindBox.findAll({
      where,
      include: [{ model: BlindBoxItem, as: 'items' }],
      order: [['created_at', 'DESC']],
    });
    return boxes;
  }

  private async getTodayDrawCount(studentId: number, boxId: number): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const count = await BlindBoxDraw.count({
      where: {
        student_id: studentId,
        blind_box_id: boxId,
        created_at: { [Op.between]: [startOfDay, endOfDay] } as any,
      },
    });
    return count;
  }

  async drawBlindBox(studentId: number, blindBoxId: number): Promise<any> {
    const box = await BlindBox.findByPk(blindBoxId, {
      include: [{ model: BlindBoxItem, as: 'items' }],
    });
    if (!box || !box.is_active) throw new Error('盲盒不存在或未启用');

    const student = await Student.findOne({ where: { id: studentId, is_deleted: 0 } });
    if (!student) throw new Error('学生不存在');
    if ((student.points ?? 0) < box.cost_points) throw new Error('积分不足');

    const todayCount = await this.getTodayDrawCount(studentId, blindBoxId);
    if (box.daily_limit && todayCount >= box.daily_limit) {
      throw new Error(`今日抽取次数已达上限（${box.daily_limit}次）`);
    }

    const rand = Math.random() * 100;
    let acc = 0;
    let drawn: any = null;
    const items = (box as any).items || [];
    for (const it of items) {
      acc += Number(it.probability) || 0;
      if (rand <= acc) {
        drawn = it;
        break;
      }
    }
    if (!drawn && items.length > 0) drawn = items[items.length - 1];

    const tx = await sequelize.transaction();
    try {
      await student.update(
        { points: (student.points ?? 0) - box.cost_points },
        { transaction: tx }
      );
      await PointsRecord.create(
        {
          student_id: studentId,
          amount: -box.cost_points,
          balance_after: (student.points ?? 0) - box.cost_points,
          source: 'blindbox',
          category: 'draw_cost',
          remark: `抽取盲盒：${box.name}`,
        },
        { transaction: tx }
      );

      let rewardData: any = { item_type: drawn?.item_type, item_id: drawn?.item_id };
      if (drawn) {
        if (drawn.item_type === 'skin' && drawn.item_id) {
          const skin = await Skin.findByPk(drawn.item_id, { transaction: tx });
          if (skin) {
            await StudentSkin.update(
              { is_equipped: 0 },
              { where: { student_id: studentId }, transaction: tx }
            );
            let ss = await StudentSkin.findOne({
              where: { student_id: studentId, skin_id: drawn.item_id },
              transaction: tx,
            });
            if (ss) {
              await ss.update({ is_equipped: 1 }, { transaction: tx });
            } else {
              await StudentSkin.create(
                { student_id: studentId, skin_id: drawn.item_id, is_equipped: 1, source: 'blindbox', granted_at: new Date() },
                { transaction: tx }
              );
            }
            rewardData.skin = skin.toJSON();
          }
        } else if (drawn.item_type === 'title' && drawn.item_id) {
          const title = await Title.findByPk(drawn.item_id, { transaction: tx });
          if (title) {
            await StudentTitle.update(
              { is_equipped: 0 },
              { where: { student_id: studentId }, transaction: tx }
            );
            let st = await StudentTitle.findOne({
              where: { student_id: studentId, title_id: drawn.item_id },
              transaction: tx,
            });
            if (st) {
              await st.update({ is_equipped: 1 }, { transaction: tx });
            } else {
              await StudentTitle.create(
                { student_id: studentId, title_id: drawn.item_id, is_equipped: 1, source: 'blindbox', granted_at: new Date() },
                { transaction: tx }
              );
            }
            rewardData.title = title.toJSON();
          }
        } else if (drawn.item_type === 'points' && drawn.points_amount) {
          const maxPoints = config.points.max;
          const current = (student.points ?? 0) - box.cost_points + box.cost_points;
          const currentNow = (student.points ?? 0);
          const next = Math.min(currentNow + drawn.points_amount, maxPoints);
          await student.update({ points: next }, { transaction: tx });
          await PointsRecord.create(
            {
              student_id: studentId,
              amount: drawn.points_amount,
              balance_after: next,
              source: 'blindbox',
              category: 'reward',
              remark: `盲盒奖励积分：${box.name}`,
            },
            { transaction: tx }
          );
          rewardData.points_amount = drawn.points_amount;
        }
      }

      const draw = await BlindBoxDraw.create(
        {
          student_id: studentId,
          blind_box_id: blindBoxId,
          item_type: drawn?.item_type || 'empty',
          item_id: drawn?.item_id,
          points_amount: drawn?.points_amount,
        },
        { transaction: tx }
      );

      await tx.commit();

      socketService.broadcastToClass(student.class_id, 'blindbox_event', {
        studentId: student.id,
        studentName: student.name,
        boxName: box.name,
        reward: rewardData,
      });
      socketService.broadcastToClass(student.class_id, 'ranking_update', { studentId: student.id });

      return { draw, reward: rewardData };
    } catch (e) {
      await tx.rollback();
      throw e;
    }
  }

  async updateBlindBox(id: number, data: any, operatorId: number): Promise<any> {
    const box = await BlindBox.findByPk(id);
    if (!box) throw new Error('盲盒不存在');
    if (box.created_by && box.created_by !== operatorId) {
      // 管理员可强制
    }
    await box.update({
      name: data.name ?? box.name,
      description: data.description ?? box.description,
      cost_points: data.costPoints ?? box.cost_points,
      daily_limit: data.dailyLimit ?? box.daily_limit,
      weekly_limit: data.weeklyLimit ?? box.weekly_limit,
      class_id: data.classId ?? box.class_id,
      is_active: data.is_active ?? box.is_active,
    });
    return box;
  }

  async getBlindBoxStats(): Promise<any> {
    const totalDraws = await BlindBoxDraw.count();
    const totalBoxes = await BlindBox.count();
    const activeBoxes = await BlindBox.count({ where: { is_active: 1 } });
    return { total_boxes: totalBoxes, active_boxes: activeBoxes, total_draws: totalDraws };
  }
}

export const blindboxService = new BlindBoxService();
export default blindboxService;
