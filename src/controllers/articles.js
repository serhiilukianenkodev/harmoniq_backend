import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
} from '../services/articles.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { formatDate } from '../utils/formatDate.js';

export const getArticlesController = async (req, res) => {
  const { page, perPage, filter } = parsePaginationParams(req.query);

  const articles = await getAllArticles({
    page,
    perPage,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found articles!',
    data: articles,
  });
};

export const getArticleByIdController = async (req, res) => {
  const { articleId } = req.params;
  const article = await getArticleById(articleId);
  if (!article) {
    throw createHttpError(404, 'Article not found');
  }

  res.json({
    status: 200,
    message: `Successfully found article with id ${articleId}!`,
    data: article,
  });
};

export const createArticleController = async (req, res) => {
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  const article = await createArticle({
    ...req.body,
    ownerId: req.user._id,
    ownerName: req.user.name,
    date: formatDate(new Date()),
    img: photoUrl,
    rate: 0,
  });

  res.status(201).json({
    status: 201,
    message: `Successfully created an article!`,
    data: article,
  });
};

export const deleteArticleController = async (req, res, next) => {
  const { articleId } = req.params;
  const userId = req.user._id;
  const article = await deleteArticle(articleId, userId);

  if (!article) {
    next(createHttpError(404, 'Article not found'));
    return;
  }

  res.status(204).send();
};

export const patchArticleController = async (req, res, next) => {
  const { articleId } = req.params;
  console.log('🚀 ~ patchArticleController ~ req.params:', req.params);
  const userId = req.user._id;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateArticle(articleId, userId, {
    ...req.body,
    img: photoUrl,
  });

  if (!result) {
    next(createHttpError(404, 'Article not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched an article!`,
    data: result.article,
  });
};
