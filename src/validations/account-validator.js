import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .min(6)
    .max(50)
    .messages({
      'string.empty': 'EMAIL_REQUIRED',
      'any.required': 'EMAIL_REQUIRED',
      'string.email': 'VALID_EMAIL_ALLOWED',
      'string.min': 'EMAIL_MIN_VALIDATION',
      'string.max': 'EMAIL_MAX_VALIDATION',
    })
    .required(),
  password: Joi.string()
    .messages({
      'string.empty': 'PASSWORD_REQUIRED',
      'any.required': 'PASSWORD_REQUIRED',
    })
    .required(),
  deviceId: Joi.string()
    .messages({
      'string.empty': 'DEVICE_ID_REQUIRED',
      'any.required': 'DEVICE_ID_REQUIRED',
    })
    .required(),
  firebaseToken: Joi.string().optional().empty().allow(''),
  deviceType: Joi.string()
    .valid('android', 'ios', 'web')
    .messages({
      'any.only': 'DEVICE_TYPE_REQUIRED',
    })
    .required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .messages({
      'string.empty': 'CURRENT_PASSWORD_REQUIRED',
      'any.required': 'CURRENT_PASSWORD_REQUIRED',
    })
    .required(),
  newPassword: Joi.string()
    .min(6)
    .max(12)
    .regex(
      /(?=[A-Za-z0-9@#$%^&+!=?,]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=?,])(?=.{6,}).*$/,
    )
    .messages({
      'string.pattern.base': 'PASSWORD_VALIDATION',
      'string.min': 'PASSWORD_MIN_VALIDATION',
      'string.max': 'PASSWORD_MAX_VALIDATION',
      'string.empty': 'NEW_PASSWORD_REQUIRED',
      'any.required': 'NEW_PASSWORD_REQUIRED',
    })
    .required(),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .messages({
      'string.empty': 'CONFIRM_NEW_PASSWORD_REQUIRED',
      'any.required': 'CONFIRM_NEW_PASSWORD_REQUIRED',
      'any.only': 'PASSWORD_NOT_MATCH',
    })
    .required(),
});

const adminForgotPasswordSchema = Joi.object().keys({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .min(6)
    .max(50)
    .messages({
      'string.empty': 'EMAIL_REQUIRED',
      'any.required': 'EMAIL_REQUIRED',
      'string.email': 'VALID_EMAIL_ALLOWED',
      'string.min': 'EMAIL_MIN_VALIDATION',
      'string.max': 'EMAIL_MAX_VALIDATION',
    })
    .required(),
});

const resetPasswordByTokenSchema = Joi.object().keys({
  newPassword: Joi.string()
    .min(6)
    .max(12)
    .regex(
      /(?=[A-Za-z0-9@#$%^&+!=?,]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=?,])(?=.{6,}).*$/,
    )
    .messages({
      'string.pattern.base': 'PASSWORD_VALIDATION',
      'string.min': 'PASSWORD_MIN_VALIDATION',
      'string.max': 'PASSWORD_MAX_VALIDATION',
      'string.empty': 'NEW_PASSWORD_REQUIRED',
      'any.required': 'NEW_PASSWORD_REQUIRED',
    })
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .messages({
      'string.empty': 'CONFIRM_NEW_PASSWORD_REQUIRED',
      'any.required': 'CONFIRM_NEW_PASSWORD_REQUIRED',
      'any.only': 'PASSWORD_NOT_MATCH',
    })
    .required(),

  token: Joi.string()
    .messages({
      'string.empty': 'TOKEN_REQUIRED',
    })
    .required(),
});

const adminProfileUpdateSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'any.required': 'FIRST_NAME_REQUIRED',
      'string.empty': 'FIRST_NAME_REQUIRED',
      'string.min': 'FIRST_NAME_MIN_VALIDATION',
      'string.max': 'FIRST_NAME_MAX_VALIDATION',
    })
    .required(),
  username: Joi.string().min(3).max(50).required(),
});

const listSchema = Joi.object({
  limit: Joi.number().integer().optional(),
  offset: Joi.number().integer().optional(),
});

const checkResourceIdNpiNumberSchema = Joi.object({
  npiNumber: Joi.string().optional().empty().allow(''),
  resourceId: Joi.string().optional().empty().allow(''),
});
const updateProfileImageSchema = Joi.object({
  profileImage: Joi.string().required(),
});
const userCreateSchema = Joi.object({
  firstName: Joi.string().trim()
    .min(3)
    .max(50)
    .messages({
      'any.required': 'FIRST_NAME_REQUIRED',
      'string.empty': 'FIRST_NAME_REQUIRED',
      'string.min': 'FIRST_NAME_MIN_VALIDATION',
      'string.max': 'FIRST_NAME_MAX_VALIDATION',
    })
    .required(),
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
  password: Joi.string()
    .min(6)
    .max(12)
    .regex(
      /(?=[A-Za-z0-9@#$%^&+!=?,]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=?,])(?=.{6,}).*$/,
    )
    .messages({
      'string.pattern.base': 'PASSWORD_VALIDATION',
      'string.min': 'PASSWORD_MIN_VALIDATION',
      'string.max': 'PASSWORD_MAX_VALIDATION',
      'string.empty': 'PASSWORD_REQUIRED',
      'any.required': 'PASSWORD_REQUIRED',
    })
    .required(),
  dateOfBirth: Joi.date()
    .messages({
      'date.format': 'DATE_OF_BIRTH_FORMAT',
      'any.required': 'DATE_REQUIRED',
    })
    .required(),
});

const userCreateSocialSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'any.required': 'FIRST_NAME_REQUIRED',
      'string.empty': 'FIRST_NAME_REQUIRED',
      'string.min': 'FIRST_NAME_MIN_VALIDATION',
      'string.max': 'FIRST_NAME_MAX_VALIDATION',
    })
    .optional()
    .empty()
    .allow(null),
  lastName: Joi.string().max(50).optional().empty()
    .allow(null),
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
    .optional()
    .empty()
    .allow(null),
  socialId: Joi.string().required().optional().empty()
    .allow(null),
  socialToken: Joi.string().required(),
  type: Joi.string().valid('facebook', 'google').required(),
  deviceId: Joi.string()
    .messages({
      'string.empty': 'DEVICE_ID_REQUIRED',
      'any.required': 'DEVICE_ID_REQUIRED',
    })
    .required(),
  firebaseToken: Joi.string().optional().empty().allow(''),
  deviceType: Joi.string()
    .valid('android', 'ios', 'web')
    .messages({
      'any.only': 'DEVICE_TYPE_REQUIRED',
    })
    .required(),
});

const userVerificationSchema = Joi.object({
  socialToken: Joi.string().required(),
  type: Joi.string().valid('facebook', 'google').required(),
  firstName: Joi.string()
    .min(3)
    .max(50)
    .messages({
      'any.required': 'FIRST_NAME_REQUIRED',
      'string.empty': 'FIRST_NAME_REQUIRED',
      'string.min': 'FIRST_NAME_MIN_VALIDATION',
      'string.max': 'FIRST_NAME_MAX_VALIDATION',
    })
    .optional()
    .empty()
    .allow(null),
  lastName: Joi.string().optional().empty().allow(null),
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
    .optional()
    .empty()
    .allow(null),
  socialId: Joi.string().required().optional().empty()
    .allow(null),
});

const changeStatusSchema = Joi.object({
  userId: Joi.string().required(),
  status: Joi.string()
    .valid('active', 'inactive', 'deleted')
    .messages({
      'any.required': 'STATUS_REQUIRED',
      'any.only': 'STATUS_TYPE_REQUIRED',
    })
    .required(),
});

const otpVerifySchema = Joi.object().keys({
  otp: Joi.number().integer().required(),
});

const signupOtpVerifySchema = Joi.object().keys({
  otp: Joi.number().integer().required(),
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
});

export default {
  loginSchema,
  changePasswordSchema,
  userCreateSchema,
  adminForgotPasswordSchema,
  resetPasswordByTokenSchema,
  adminProfileUpdateSchema,
  listSchema,
  checkResourceIdNpiNumberSchema,
  updateProfileImageSchema,
  changeStatusSchema,
  userCreateSocialSchema,
  userVerificationSchema,
  otpVerifySchema,
  signupOtpVerifySchema,
};
