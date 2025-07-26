import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';

const router = Router();

router.use('/authors', contactsRouter);
router.use('/auth', authRouter);

export default router;
