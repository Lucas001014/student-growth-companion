import { Router } from 'express';
import {
  confirmHomework,
  uploadHomework,
  setVisibility,
  getPublicHomework,
  getMyHomework,
} from '../controllers/homework.controller';
import { auth, allowParent, requireRole } from '../middleware/auth.middleware';
import { uploadSingle } from '../middleware/upload.middleware';

const router = Router();

router.post('/confirm', auth, allowParent, confirmHomework);
router.post('/upload', auth, allowParent, uploadSingle, uploadHomework);
router.put('/upload/:id/visibility', auth, requireRole(['admin', 'teacher']), setVisibility);
router.get('/public', auth, getPublicHomework);
router.get('/mine', auth, requireRole(['student']), getMyHomework);

export default router;
