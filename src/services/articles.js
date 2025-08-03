import { ArticlesCollection } from '../db/models/article.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllArticles = async ({ page = 1, perPage = 12, filter }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const articlesQuery = ArticlesCollection.find();
  if (filter === 'Popular') {
    articlesQuery.sort({ rate: 'desc' });
  }

  const [articlesCount, articles] = await Promise.all([
    ArticlesCollection.find().countDocuments(),
    articlesQuery.skip(skip).limit(limit).exec(),
  ]);

  const paginationData = calculatePaginationData(articlesCount, perPage, page);

  return {
    articles,
    ...paginationData,
  };
};

export const getArticleById = async (articleId) => {
  const article = await ArticlesCollection.findOne({ _id: articleId });
  return article;
};

export const createArticle = async (payload) => {
  const article = await ArticlesCollection.create(payload);
  return article;
};

export const deleteArticle = async (articleId, userId) => {
  const article = await ArticlesCollection.findOneAndDelete({
    _id: articleId,
    ownerId: userId,
  });

  return article;
};

export const updateArticle = async (
  articleId,
  userId,
  payload,
  options = {},
) => {
  const rawResult = await ArticlesCollection.findOneAndUpdate(
    { _id: articleId, ownerId: userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    article: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
