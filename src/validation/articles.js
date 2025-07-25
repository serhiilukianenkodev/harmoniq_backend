import Joi from 'joi';

export const createArticleSchema = Joi.object({
  title: Joi.string().min(3).max(48).required(),
  desc: Joi.string().min(100).max(4000).required(),
});

export const updateArticleSchema = Joi.object({
  title: Joi.string().min(3).max(48),
  desc: Joi.string().min(100).max(4000),
});
