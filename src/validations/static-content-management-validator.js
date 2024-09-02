import Joi from 'joi';

const addStaticContentPageSchema = Joi.object({
  metaTitle: Joi.string().required(),
  metaDescription: Joi.string().required(),
  content: Joi.string().required(),
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
});

const addAndUpdateBannerAndPageSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  type: Joi.string().valid('top', 'bottom', 'staticBlock').required(),
  bannerImage: Joi.string().optional(),
  title: Joi.string().required(),
  subTitle: Joi.string().optional(),
  description: Joi.string().optional(),
  content: Joi.string().optional(),
  buttonLabel: Joi.string().optional().empty().allow(null),
});

const addAndUpdateFooterBlockSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  title1: Joi.string().required(),
  content1: Joi.string().required(),
  title2: Joi.string().required(),
  content2: Joi.string().required(),
  title3: Joi.string().required(),
  content3: Joi.string().required(),
});

export default {
  addStaticContentPageSchema,
  addAndUpdateBannerAndPageSchema,
  addAndUpdateFooterBlockSchema,
};
