import Joi from 'joi';

const contactAndSupportSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).optional(),
  phoneNumber: Joi.string().min(6)
    .max(15)
    .regex(/^\d+$/)
    .messages({
      'string.pattern.base': 'ONLY_NUMERIC_ALLOWED',
      'string.min': 'PHONE_MAX_VALIDATION',
      'string.max': 'PHONE_MAX_VALIDATION',
    })
    .required(),
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
    .required(),
  message: Joi.string().required(),
});

export default {
  contactAndSupportSchema,
};
