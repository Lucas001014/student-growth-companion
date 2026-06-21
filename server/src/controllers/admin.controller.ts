import { Request, Response } from 'express';
import adminService from '../services/admin.service';
import { ok, fail } from '../middleware/error.middleware';

export async function getDashboard(req: Request, res: Response) {
  try {
    const result = await adminService.getDashboard();
    return ok(res, result);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export async function createTeacher(req: Request, res: Response) {
  try {
    const { name, phone, password, classIds } = req.body;
    if (!name || !phone || !password) return fail(res, '参数缺失');
    const result = await adminService.createTeacher({
      name,
      phone,
      password,
      classIds: Array.isArray(classIds) ? classIds : [],
    });
    return ok(res, result, '创建成功');
  } catch (e: any) {
    return fail(res, e.message || '创建失败');
  }
}

export async function getTeachers(req: Request, res: Response) {
  try {
    const result = await adminService.getTeachers();
    return ok(res, result);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export async function getClasses(req: Request, res: Response) {
  try {
    const result = await adminService.getClassesWithStats();
    return ok(res, result);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export async function createSkin(req: Request, res: Response) {
  try {
    const result = await adminService.createSkin(req.body);
    return ok(res, result, '创建成功');
  } catch (e: any) {
    return fail(res, e.message || '创建失败');
  }
}

export async function getSkins(req: Request, res: Response) {
  try {
    const { Skin } = await import('../models');
    const list = await Skin.findAll();
    return ok(res, list);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export async function updateSkin(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await adminService.updateSkin(id, req.body);
    return ok(res, result, '更新成功');
  } catch (e: any) {
    return fail(res, e.message || '更新失败');
  }
}

export async function deleteSkin(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await adminService.deleteSkin(id);
    return ok(res, result, '删除成功');
  } catch (e: any) {
    return fail(res, e.message || '删除失败');
  }
}

export async function createTitle(req: Request, res: Response) {
  try {
    const result = await adminService.createTitle(req.body);
    return ok(res, result, '创建成功');
  } catch (e: any) {
    return fail(res, e.message || '创建失败');
  }
}

export async function getTitles(req: Request, res: Response) {
  try {
    const { Title } = await import('../models');
    const list = await Title.findAll();
    return ok(res, list);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export async function updateTitle(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await adminService.updateTitle(id, req.body);
    return ok(res, result, '更新成功');
  } catch (e: any) {
    return fail(res, e.message || '更新失败');
  }
}

export async function deleteTitle(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await adminService.deleteTitle(id);
    return ok(res, result, '删除成功');
  } catch (e: any) {
    return fail(res, e.message || '删除失败');
  }
}

export async function createIdentityBadge(req: Request, res: Response) {
  try {
    const result = await adminService.createIdentityBadge(req.body);
    return ok(res, result, '创建成功');
  } catch (e: any) {
    return fail(res, e.message || '创建失败');
  }
}

export async function getIdentityBadges(req: Request, res: Response) {
  try {
    const { IdentityBadge } = await import('../models');
    const list = await IdentityBadge.findAll();
    return ok(res, list);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export async function updateIdentityBadge(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await adminService.updateIdentityBadge(id, req.body);
    return ok(res, result, '更新成功');
  } catch (e: any) {
    return fail(res, e.message || '更新失败');
  }
}

export async function deleteIdentityBadge(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const result = await adminService.deleteIdentityBadge(id);
    return ok(res, result, '删除成功');
  } catch (e: any) {
    return fail(res, e.message || '删除失败');
  }
}

export async function getConfig(req: Request, res: Response) {
  try {
    const result = adminService.getConfig();
    return ok(res, result);
  } catch (e: any) {
    return fail(res, e.message || '查询失败');
  }
}

export async function updateConfig(req: Request, res: Response) {
  try {
    const result = await adminService.updateConfig(req.body);
    return ok(res, result, '更新成功');
  } catch (e: any) {
    return fail(res, e.message || '更新失败');
  }
}

export async function exportData(req: Request, res: Response) {
  try {
    const format = (req.query.format as string) || 'csv';
    const type = (req.query.type as any) || 'students';
    const data = await adminService.exportData(type);
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${type}.csv"`);
      return res.send('\uFEFF' + data);
    }
    return ok(res, data);
  } catch (e: any) {
    return fail(res, e.message || '导出失败');
  }
}

export default {
  getDashboard,
  createTeacher,
  getTeachers,
  getClasses,
  createSkin,
  getSkins,
  updateSkin,
  deleteSkin,
  createTitle,
  getTitles,
  updateTitle,
  deleteTitle,
  createIdentityBadge,
  getIdentityBadges,
  updateIdentityBadge,
  deleteIdentityBadge,
  getConfig,
  updateConfig,
  exportData,
};
