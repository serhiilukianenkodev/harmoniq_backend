import { ArticlesCollection } from '../db/models/article.js';
import { UsersCollection } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import mongoose from 'mongoose';

export const getAllUsers = async ({ page = 1, perPage = 20 }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = UsersCollection.find();

  const [usersCount, users] = await Promise.all([
    UsersCollection.find().countDocuments(),
    contactsQuery.skip(skip).limit(limit).exec(),
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

export const getSavedArticles = async (authorsId) => {
  const user = await UsersCollection.findById(authorsId).populate(
    'savedArticles',
  );
  return user.savedArticles;
};

export const getOwnArticles = async (authorsId) => {
  const articles = await ArticlesCollection.find({ ownerId: authorsId });
  return { articles };
};

export const addSavedArticleForUser = async (authorsId, articleId) => {
  const user = await UsersCollection.findById(authorsId);
  if (!user) return null;

  const articleObjectId = new mongoose.Types.ObjectId(articleId);
  if (!user.savedArticles.includes(articleObjectId)) {
    user.savedArticles.push(articleObjectId);
    await user.save();
  }

  return user;
};

export const deleteSavedArticleForUser = async (authorsId, articleId) => {
  const user = await UsersCollection.findById(authorsId);
  if (!user) return null;

  user.savedArticles = user.savedArticles.filter(
    (id) => id.toString() !== articleId,
  );
  await user.save();

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
