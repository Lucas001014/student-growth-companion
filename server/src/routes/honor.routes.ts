import { Router } from 'express';
import {
  grantPoints,
  grantSkin,
  grantTitle,
  getStudentHonor,
} from '../controllers/honor.controller';
import { auth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(auth, requireRole(['admin', 'teacher']));

router.post('/points', grantPoints);
router.post('/skin/grant', grantSkin);
router.post('/title/grant', grantTitle);
router.get('/student/:id', getStudentHonor);

export default router;
