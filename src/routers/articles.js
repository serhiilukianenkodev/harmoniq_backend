import { Router } from 'express';

import {
  createArticleController,
  deleteArticleController,
  getArticleByIdController,
  getArticlesController,
  patchArticleController,
} from '../controllers/articles.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
import {
  createArticleSchema,
  updateArticleSchema,
} from '../validation/articles.js';

const router = Router();

router.get('/', ctrlWrapper(getArticlesController));
router.get('/:articleId', ctrlWrapper(getArticleByIdController));
router.post(
  '/',
  upload.single('photo'),
  authenticate,
  validateBody(createArticleSchema),
  ctrlWrapper(createArticleController),
);
router.delete(
  '/:articleId',
  authenticate,
  ctrlWrapper(deleteArticleController),
);
router.patch(
  '/:articleId',
  upload.single('photo'),
  authenticate,
  validateBody(updateArticleSchema),
  ctrlWrapper(patchArticleController),
);

export default router;
