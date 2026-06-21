import { Router } from 'express';
import {
  submitRequest,
  getRequestList,
  approveRequest,
} from '../controllers/request.controller';
import { auth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.post('/submit', auth, requireRole(['student']), submitRequest);
router.get('/list', auth, requireRole(['admin', 'teacher']), getRequestList);
router.post('/:id/approve', auth, requireRole(['admin', 'teacher']), approveRequest);

export default router;
