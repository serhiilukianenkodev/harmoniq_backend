import { Router } from 'express';
import articlesRouter from './articles.js';
import authRouter from './auth.js';

const router = Router();

router.use('/articles', articlesRouter);
router.use('/auth', authRouter);

export default router;
