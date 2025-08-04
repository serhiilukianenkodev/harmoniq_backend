import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import {
  addSavedArticleForUser,
  deleteSavedArticleForUser,
  getAllUsers,
  getOwnArticles,
  getSavedArticles,
  getUserById,
} from '../services/user.js';
import { SessionsCollection } from '../db/models/session.js';

import { updateUserPhoto } from '../services/user.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getAllUsersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const users = await getAllUsers({
    page,
    perPage,
  });

  res.json({
    status: 200,
    message: 'Successfully found users!',
    data: users,
  });
};

export const getUserByIdController = async (req, res) => {
  const { authorsId } = req.params;
  const user = await getUserById(authorsId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: `Successfully found user with id ${authorsId}!`,
    data: user,
  });
};

export const getSavedArticlesByAuthorIdController = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  const session = await SessionsCollection.findOne({ _id: sessionId });
  const userId = session.userId;
  const user = await getSavedArticles(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: `Successfully found user's saved articles with id ${userId}!`,
    data: user,
  });
};

export const saveArticleByAuthorIdController = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  const session = await SessionsCollection.findOne({ _id: sessionId });
  const userId = session.userId;
  const { articleId } = req.params;
  const updatedUser = await addSavedArticleForUser(userId, articleId);

  if (!updatedUser) throw createHttpError(404, 'User not found');

  res.json({
    status: 200,
    message: 'Article added to saved list',
    data: updatedUser.savedArticles,
  });
};

export const removeSavedArticleByAuthorIdController = async (req, res) => {
  const sessionId = req.cookies.sessionId;
  const session = await SessionsCollection.findOne({ _id: sessionId });
  const userId = session.userId;
  const { articleId } = req.params;
  const updatedUser = await deleteSavedArticleForUser(userId, articleId);

  if (!updatedUser) throw createHttpError(404, 'User not found');

  res.json({
    status: 204,
    message: 'Article removed from saved list',
  });
};

export const getOwnArticlesByAuthorIdController = async (req, res) => {
  const { authorsId } = req.params;
  const user = await getOwnArticles(authorsId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: `Successfully found user's own articles with id ${authorsId}!`,
    data: user,
  });
};

export const updateUserPhotoController = async (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  const session = await SessionsCollection.findOne({ _id: sessionId });
  const userId = session.userId;
  const photo = req.file;
  let photoUrl;

  if (photo) {
    if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const user = await updateUserPhoto(userId, photoUrl);

  if (!user) {
    next(createHttpError(404, 'User not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully update user photo!`,
    data: user,
  });
};
