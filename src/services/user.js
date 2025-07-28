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
