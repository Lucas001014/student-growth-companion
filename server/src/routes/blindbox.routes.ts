import { Router } from 'express';
import {
  createBlindBox,
  getAvailableBlindBoxes,
  drawBlindBox,
  updateBlindBox,
} from '../controllers/blindbox.controller';
import { auth, requireRole, requireStudentMode } from '../middleware/auth.middleware';

const router = Router();

router.post('/', auth, requireRole(['admin', 'teacher']), createBlindBox);
router.get('/list', auth, requireRole(['student']), requireStudentMode, getAvailableBlindBoxes);
router.post('/draw', auth, requireRole(['student']), requireStudentMode, drawBlindBox);
router.put('/:id', auth, requireRole(['admin', 'teacher']), updateBlindBox);

export default router;
