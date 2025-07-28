import mongoose from 'mongoose';
import { ArticlesCollection } from '../db/models/article.js';
import { UsersCollection } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

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

// export const getUserById = async (userId) => {
//   const objectId = new mongoose.Types.ObjectId(userId);
//   const user = await UsersCollection.findOne({ _id: objectId });
//   return user;
// };

export const getUserById = async (userId) => {
  const user = await UsersCollection.findOne({ _id: userId });
  return user;
};

export const getSavedArticles = async (userId) => {
  const _id = userId;
  const user = await UsersCollection.findOne(_id);
  const savedArticles = await ArticlesCollection.find({
    _id: { $in: user.savedArticles },
  });
  return savedArticles;
};

export const getOwnArticles = async (userId) => {
  const articles = await ArticlesCollection.find({ ownerId: userId });
  return { articles };
};
