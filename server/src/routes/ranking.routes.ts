import { Router } from 'express';
import { getClassRanking } from '../controllers/ranking.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();

router.get('/class', auth, getClassRanking);

export default router;
