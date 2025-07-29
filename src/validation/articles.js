import Joi from 'joi';

export const createArticleSchema = Joi.object({
  title: Joi.string().min(3).max(48).required(),
  desc: Joi.string().min(100).max(4000).required(),
  photo: Joi.object({
    size: Joi.number()
      .max(1024 * 1024)
      .required()
      .messages({
        "number.max": "File size must be less than 1MB",
      }),
  })
    .required()
    .messages({
      "any.required": "Photo is required",
    }),
});

export const updateArticleSchema = Joi.object({
  title: Joi.string().min(3).max(48),
  desc: Joi.string().min(100).max(4000),
});
