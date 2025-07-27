import { Router } from 'express';
import articlesRouter from './articles.js';
import authRouter from './auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import { updateUserPhotoController } from '../controllers/user.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { uploadUserPhotoSchema } from '../validation/user.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use('/articles', articlesRouter);
router.use('/auth', authRouter);
router.post(
  '/user/photo',
  authenticate,
  validateBody(uploadUserPhotoSchema),
  upload.single('photo'),
  ctrlWrapper(updateUserPhotoController),
);

export default router;
