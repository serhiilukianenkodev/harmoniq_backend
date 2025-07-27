import { Router } from 'express';
import articlesRouter from './articles.js';
import authRouter from './auth.js';
import userRouter from './user.js';

const router = Router();

router.use('/articles', articlesRouter);
router.use('/auth', authRouter);
router.use('/authors', userRouter);

export default router;
