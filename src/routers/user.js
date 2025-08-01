import { Router } from 'express';
import {
  getAllUsersController,
  getOwnArticlesByAuthorIdController,
  getSavedArticlesByAuthorIdController,
  getUserByIdController,
  removeSavedArticleByAuthorIdController,
  saveArticleByAuthorIdController,
} from '../controllers/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get('/', ctrlWrapper(getAllUsersController));

router.get(
  '/saved-articles',
  authenticate,
  ctrlWrapper(getSavedArticlesByAuthorIdController),
);

router.get('/:authorsId', ctrlWrapper(getUserByIdController));

router.post(
  '/saved-articles/:articleId',
  authenticate,
  ctrlWrapper(saveArticleByAuthorIdController),
);

router.delete(
  '/saved-articles/:articleId',
  authenticate,
  ctrlWrapper(removeSavedArticleByAuthorIdController),
);

router.get(
  '/:authorsId/articles',
  ctrlWrapper(getOwnArticlesByAuthorIdController),
);

export default router;
