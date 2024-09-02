import Joi from 'joi';

const addAndUpdatePopularLocationSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  popularLocationImage: Joi.string().optional(),
  location: Joi.string().required(),
  locationAddress: Joi.string().required(),
  latitude: Joi.string().regex(
    /^-?\d{1,2}(\.\d+)?$/,
  ).messages({
    'string.pattern.base': 'LOCATION_VALIDATION',
  }).required(),
  longitude: Joi.string().regex(
    /^-?\d{1,3}(\.\d+)?$/,
  ).messages({
    'string.pattern.base': 'LOCATION_VALIDATION',
  }).required(),
  status: Joi.string().valid('active', 'inactive', 'deleted'),
});

const UpdatePopularLocationStatusSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  status: Joi.string().valid('active', 'inactive', 'deleted'),
});

export default {
  addAndUpdatePopularLocationSchema,
  UpdatePopularLocationStatusSchema,
};
