import { Router } from 'express';
import { login, switchMode, changePassword } from '../controllers/auth.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/mode/switch', auth, switchMode);
router.post('/change-password', auth, changePassword);

export default router;
