import Joi from 'joi';

export const uploadUserPhotoSchema = Joi.object({
  photo: Joi.object({
    size: Joi.number().max(1024 * 1024),
  }).required(),
});
