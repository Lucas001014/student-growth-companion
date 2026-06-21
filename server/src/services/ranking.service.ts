import { Op, fn, col, where as WhereClause } from 'sequelize';
import {
  Student,
  ClassModel,
  IdentityBadge,
  StudentSkin,
  StudentTitle,
  Skin,
  Title,
} from '../models/index';
import redis from '../config/redis';

class RankingService {
  private async getStudentsSortedByPoints(
    classId: number,
    period: 'week' | 'month' | 'semester' | 'all'
  ): Promise<any[]> {
    const where: any = { class_id: classId, is_deleted: 0 };
    // points 是存量字段，按周期过滤时可以结合 points_records（这里简化处理，直接用学生 points）
    const students = await Student.findAll({
      where,
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
          include: [{ model: Skin, as: 'skin', attributes: ['id', 'name', 'image_url', 'rarity'] }],
        },
        {
          model: StudentTitle,
          as: 'equipped_title',
          attributes: ['title_id', 'is_equipped'],
          include: [{ model: Title, as: 'title', attributes: ['id', 'name', 'color', 'icon'] }],
        },
      ],
      order: [['points', 'DESC'], ['student_no', 'ASC']],
    });
    return students.map((s) => {
      const p: any = s.toJSON();
      delete p.parent_password;
      return p;
    });
  }

  private async getStudentsBySkinCount(classId: number): Promise<any[]> {
    const students = await Student.findAll({
      where: { class_id: classId, is_deleted: 0 },
      include: [
        {
          model: StudentSkin,
          as: 'skins',
          attributes: ['skin_id'],
        },
      ],
    });
    const list = students.map((s) => {
      const p: any = s.toJSON();
      delete p.parent_password;
      p.ranking_value = (p.skins || []).length;
      return p;
    });
    list.sort((a, b) => b.ranking_value - a.ranking_value);
    return list;
  }

  private async getStudentsByTitleCount(classId: number): Promise<any[]> {
    const students = await Student.findAll({
      where: { class_id: classId, is_deleted: 0 },
      include: [
        {
          model: StudentTitle,
          as: 'titles',
          attributes: ['title_id'],
        },
      ],
    });
    const list = students.map((s) => {
      const p: any = s.toJSON();
      delete p.parent_password;
      p.ranking_value = (p.titles || []).length;
      return p;
    });
    list.sort((a, b) => b.ranking_value - a.ranking_value);
    return list;
  }

  async getClassRanking(
    classId: number,
    type: 'points' | 'skins' | 'titles',
    period: 'week' | 'month' | 'semester' | 'all' = 'all'
  ): Promise<any[]> {
    const cacheKey = `ranking:${classId}:${type}:${period}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }

    let list: any[] = [];
    if (type === 'points') {
      list = await this.getStudentsSortedByPoints(classId, period);
    } else if (type === 'skins') {
      list = await this.getStudentsBySkinCount(classId);
    } else if (type === 'titles') {
      list = await this.getStudentsByTitleCount(classId);
    }

    list = list.map((item, idx) => ({ ...item, rank: idx + 1 }));

    try {
      await redis.set(cacheKey, JSON.stringify(list), 300);
    } catch {}

    return list;
  }

  async refreshClassRanking(classId: number): Promise<void> {
    const types = ['points', 'skins', 'titles'];
    const periods = ['week', 'month', 'semester', 'all'];
    for (const t of types) {
      for (const p of periods) {
        try {
          await redis.del(`ranking:${classId}:${t}:${p}`);
        } catch {}
      }
    }
  }

  async getStudentRank(
    studentId: number,
    classId: number,
    type: 'points' | 'skins' | 'titles',
    period: 'week' | 'month' | 'semester' | 'all' = 'all'
  ): Promise<any> {
    const list = await this.getClassRanking(classId, type, period);
    const rank = list.find((item: any) => item.id === studentId);
    return { rank: rank?.rank, total: list.length, detail: rank };
  }
}

export const rankingService = new RankingService();
export default rankingService;
