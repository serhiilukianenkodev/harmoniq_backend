import createHttpError from 'http-errors';
import { ArticlesCollection } from '../db/models/article.js';
import { UsersCollection } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import mongoose from 'mongoose';

export const getAllUsers = async ({ page = 1, perPage = 20 }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const usersQuery = UsersCollection.find();

  const [usersCount, users] = await Promise.all([
    UsersCollection.find().countDocuments(),
    usersQuery.skip(skip).limit(limit).exec(),
  ]);

  const paginationData = calculatePaginationData(usersCount, perPage, page);

  return {
    users,
    ...paginationData,
  };
};

export const getUserById = async (authorsId) => {
  const user = await UsersCollection.findById(authorsId);
  return user;
};

export const getSavedArticles = async (authorsId, page = 1, perPage = 12) => {

const user = await UsersCollection.findById(authorsId).populate(
    'savedArticles',
  );

const savedArticles = user.savedArticles;
const totalItems = savedArticles.length;
const skip = (page - 1) * perPage;

const paginatedArticles = savedArticles.slice(skip, skip + perPage);

const paginationData = calculatePaginationData(totalItems, perPage, page);

return  {articles: paginatedArticles,
  ...paginationData,
  };
};

export const getOwnArticles = async (authorsId, page = 1, perPage = 12) => {

  const articles = await ArticlesCollection.find({ ownerId: authorsId });

  const totalItems = articles.length;
  const skip = (page - 1) * perPage;

const paginatedOwnArticles = articles.slice(skip, skip + perPage);

const paginationData = calculatePaginationData(totalItems, perPage, page);


  return {articles: paginatedOwnArticles,
    ...paginationData,
  }
};

export const addSavedArticleForUser = async (authorsId, articleId) => {
  const user = await UsersCollection.findById(authorsId);
  if (!user) return null;

  const articleObjectId = new mongoose.Types.ObjectId(articleId);
  if (!user.savedArticles.includes(articleObjectId)) {
    user.savedArticles.push(articleObjectId);
    await user.save();

    await ArticlesCollection.findByIdAndUpdate(articleObjectId, {
      $inc: { rate: 1 },
    });
  }

  return user;
};

export const deleteSavedArticleForUser = async (authorsId, articleId) => {
  const user = await UsersCollection.findById(authorsId);
  if (!user) return null;

  const articleObjectId = new mongoose.Types.ObjectId(articleId);
  if (!user.savedArticles.includes(articleObjectId)) {
    throw createHttpError(404, 'Article not found in saved list');
  }
  user.savedArticles = user.savedArticles.filter(
    (id) => id.toString() !== articleId.toString(),
  );
  await user.save();

  await ArticlesCollection.findByIdAndUpdate(articleObjectId, {
    $inc: { rate: -1 },
  });

  return user;
};

export const updateUserPhoto = async (userId, photoUrl) => {
  const user = await UsersCollection.findOneAndUpdate(
    { _id: userId },
    { avatarUrl: photoUrl },
    { new: true },
  );

  if (!user) return null;

  return user;
};
