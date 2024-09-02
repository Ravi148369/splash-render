import Joi from 'joi';

const addOwnerPageSettingSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  type: Joi.string()
    .valid('topBanner', 'list', 'inventory', 'review', 'rental', 'bottomBanner')
    .required(),
  ownerPageImage: Joi.string().optional().empty().allow(null),
  heading: Joi.string().optional().empty().allow(null),
  description: Joi.string().optional(),
  title: Joi.string().optional().empty().allow(null),
  content: Joi.string().optional().empty().allow(null),
  title2: Joi.string().optional().empty().allow(null),
  content2: Joi.string().optional().empty().allow(null),
  title3: Joi.string().optional().empty().allow(null),
  content3: Joi.string().optional().empty().allow(null),
});

export default {
  addOwnerPageSettingSchema,
};
