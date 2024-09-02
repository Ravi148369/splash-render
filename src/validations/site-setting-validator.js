import Joi from 'joi';

const addSiteSettingSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional(),
  facebookUrl: Joi.string().allow(''),
  twitterUrl: Joi.string().allow(''),
  instagramUrl: Joi.string().allow(''),
  youTubeUrl: Joi.string().allow(''),
  pinterestUrl: Joi.string().allow(''),
  linkedinUrl: Joi.string().allow(''),
  tikTokUrl: Joi.string().allow(''),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } })
    .min(6)
    .max(50)
    .messages({
      'any.required': 'EMAIL_REQUIRED',
      'string.empty': 'EMAIL_REQUIRED',
      'string.email': 'VALID_EMAIL_ALLOWED',
      'string.min': 'EMAIL_MIN_VALIDATION',
      'string.max': 'EMAIL_MAX_VALIDATION',
    })
    .allow(''),
  mobileNumber: Joi.string().min(6)
    .max(15)
    .regex(/^\d+$/)
    .messages({
      'string.pattern.base': 'ONLY_NUMERIC_ALLOWED',
      'string.min': 'PHONE_MAX_VALIDATION',
      'string.max': 'PHONE_MAX_VALIDATION',
    })
    .allow(''),
  address: Joi.string().allow(''),
});

export default {
  addSiteSettingSchema,
};
