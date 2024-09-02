import Joi from 'joi';

const addAndUpdateBlogSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  blogImage: Joi.string().required(),
  title: Joi.string().required(),
  url: Joi.string().required(),
  status: Joi.string().valid('active', 'deleted'),
});

const UpdateBlogStatusSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  status: Joi.string().valid('active', 'deleted'),
});

export default {
  addAndUpdateBlogSchema,
  UpdateBlogStatusSchema,
};
