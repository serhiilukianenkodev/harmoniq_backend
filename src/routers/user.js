import { Router } from 'express';
import {
  getAllUsersController,
  getOwnArticlesController,
  getSavedArticlesController,
  getUserByIdController,
} from '../controllers/user.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.get('/', ctrlWrapper(getAllUsersController));

router.get('/:authorsId', ctrlWrapper(getUserByIdController));

router.get(
  '/:authorsId/saved-articles',
  ctrlWrapper(getSavedArticlesController),
);

router.get('/:authorsId/articles', ctrlWrapper(getOwnArticlesController));

export default router;
