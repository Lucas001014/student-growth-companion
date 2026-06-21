import { Router } from 'express';
import {
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
} from '../controllers/admin.controller';
import { auth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(auth, requireRole(['admin']));

router.get('/dashboard', getDashboard);
router.post('/teachers', createTeacher);
router.get('/teachers', getTeachers);
router.get('/classes', getClasses);

router.get('/skins', getSkins);
router.post('/skins', createSkin);
router.put('/skins/:id', updateSkin);
router.delete('/skins/:id', deleteSkin);

router.get('/titles', getTitles);
router.post('/titles', createTitle);
router.put('/titles/:id', updateTitle);
router.delete('/titles/:id', deleteTitle);

router.get('/identity-badges', getIdentityBadges);
router.post('/identity-badges', createIdentityBadge);
router.put('/identity-badges/:id', updateIdentityBadge);
router.delete('/identity-badges/:id', deleteIdentityBadge);

router.get('/config', getConfig);
router.put('/config', updateConfig);

router.get('/export', exportData);

export default router;
