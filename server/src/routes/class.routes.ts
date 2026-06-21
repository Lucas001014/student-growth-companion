import { Router } from 'express';
import {
  getStudents,
  createStudent,
  batchImportStudents,
  updateStudent,
  deleteStudent,
  setStudentIdentity,
} from '../controllers/class.controller';
import { auth, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.use(auth, requireRole(['admin', 'teacher']));

router.get('/students', getStudents);
router.post('/students', createStudent);
router.post('/students/batch', batchImportStudents);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.put('/students/:id/identity', setStudentIdentity);

export default router;
