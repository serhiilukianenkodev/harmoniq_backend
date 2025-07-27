import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import {
  getAllUsers,
  getOwnArticles,
  getSavedArticles,
  getUserById,
} from '../services/user.js';

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
  const { userId } = req.params;
  const user = await getUserById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: `Successfully found user with id ${userId}!`,
    data: user,
  });
};

export const getSavedArticlesController = async (req, res) => {
  const { userId } = req.params;
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

export const getOwnArticlesController = async (req, res) => {
  const { userId } = req.params;
  const user = await getOwnArticles(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: `Successfully found user's own articles with id ${userId}!`,
    data: user,
  });
};
