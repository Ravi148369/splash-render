import Joi from 'joi';

const changeStatusSchema = Joi.object({
  status: Joi.string()
    .valid('active', 'inactive')
    .messages({
      'any.required': 'STATUS_REQUIRED',
      'any.only': 'STATUS_TYPE_REQUIRED',
    })
    .required(),
});

const userProfileUpdateSchema = Joi.object({
  firstName: Joi.string().trim().min(3).max(50)
    .messages({
      'any.required': 'FIRST_NAME_REQUIRED',
      'string.empty': 'FIRST_NAME_REQUIRED',
      'string.min': 'FIRST_NAME_MIN_VALIDATION',
      'string.max': 'FIRST_NAME_MAX_VALIDATION',
    })
    .required(),
  lastName: Joi.string().trim().min(3).max(50)
    .messages({
      'any.required': 'LAST_NAME_REQUIRED',
      'string.empty': 'LAST_NAME_REQUIRED',
      'string.min': 'LAST_NAME_MIN_VALIDATION',
      'string.max': 'LAST_NAME_MAX_VALIDATION',
    })
    .optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
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
  profileImage: Joi.string().optional().empty().allow(''),
  dateOfBirth: Joi.date()
    .messages({
      'date.format': 'DATE_OF_BIRTH_FORMAT',
      'any.required': 'DATE_REQUIRED',
    })
    .required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  countryCode: Joi.string()
    .min(1)
    .max(6)
    .messages({
      'string.empty': 'COUNTRY_CODE_REQUIRED',
      'any.required': 'COUNTRY_CODE_REQUIRED',
    })
    .required(),
  phoneNumber: Joi.string()
    .min(6)
    .max(15)
    .regex(/^\d+$/)
    .messages({
      'string.pattern.base': 'ONLY_NUMERIC_ALLOWED',
      'string.min': 'PHONE_MAX_VALIDATION',
      'string.max': 'PHONE_MAX_VALIDATION',
    })
    .required(),
  language: Joi.string().min(1).required(),
  currency: Joi.string().min(1).required(),
  whereYouLive: Joi.string().min(1).required(),
  describeYourself: Joi.string().min(1).required(),
});

export default {
  changeStatusSchema,
  userProfileUpdateSchema,
};
