import Joi from 'joi';

const addAboutUsPageSettingSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  type: Joi.string().valid('block1', 'block2', 'block3', 'block4').required(),
  aboutUsPageImage: Joi.string().optional().empty().allow(null),
  subTitle: Joi.string().optional().empty().allow(null),
  title: Joi.string().optional().empty().allow(null),
  content: Joi.string().optional().empty().allow(null),
  title2: Joi.string().optional().empty().allow(null),
  content2: Joi.string().optional().empty().allow(null),
  title3: Joi.string().optional().empty().allow(null),
  content3: Joi.string().optional().empty().allow(null),
});

export default {
  addAboutUsPageSettingSchema,
};
