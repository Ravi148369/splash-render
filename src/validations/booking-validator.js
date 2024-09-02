import Joi from 'joi';

const addBookingSchema = Joi.object({
  boatId: Joi.number().integer().greater(-1).required(),
  duration: Joi.number().integer().greater(-1).required(),
  bookingDate: Joi.date()
    .greater(Date.now() - 24 * 60 * 60 * 1000)
    .message('Invalid Booking date')
    .required(),
  startTime: Joi.string(),
  endTime: Joi.string(),
  amount: Joi.number().greater(0).required(),
  currency: Joi.string(),
  identityNumber: Joi.string().max(100).optional(),
  firstName: Joi.string().max(50).optional(),
  lastName: Joi.string().max(50).optional(),
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
    .optional(),
  mobileNumber: Joi.string().min(6)
    .max(15)
    .regex(/^\d+$/)
    .messages({
      'string.pattern.base': 'ONLY_NUMERIC_ALLOWED',
      'string.min': 'PHONE_MAX_VALIDATION',
      'string.max': 'PHONE_MAX_VALIDATION',
    })
    .optional(),
  description: Joi.string().optional(),
  dateOfBirth: Joi.date().messages({
    'date.format': 'YYYY-MM-DD',
  }).optional(),
  countryId: Joi.number().integer().greater(-1).optional(),
  bookingRequestId: Joi.number().integer().greater(0).allow(null)
    .optional(),
});

const bookingCheckoutSchema = Joi.object({
  id: Joi.number().integer().greater(0).required(),
  boatId: Joi.number().integer().greater(0).required(),
  token: Joi.string()
    .messages({
      'any.required': 'TOKEN_REQUIRED',
      'string.base': 'TOKEN_REQUIRED',
      'string.empty': 'TOKEN_REQUIRED',
    }).required(),
});

const addEventBookingSchema = Joi.object({
  eventId: Joi.number().integer().greater(-1).required(),
  adults: Joi.number().greater(-1).required(),
  children: Joi.number().greater(-1).required(),
  amount: Joi.number().greater(0).required(),
  currency: Joi.string(),
  identityNumber: Joi.string().max(100).optional(),
  firstName: Joi.string().max(50).optional(),
  lastName: Joi.string().max(50).optional(),
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
    .optional(),
  mobileNumber: Joi.string().min(6)
    .max(15)
    .regex(/^\d+$/)
    .messages({
      'string.pattern.base': 'ONLY_NUMERIC_ALLOWED',
      'string.min': 'PHONE_MAX_VALIDATION',
      'string.max': 'PHONE_MAX_VALIDATION',
    })
    .optional(),
  dateOfBirth: Joi.date().messages({
    'date.format': 'YYYY-MM-DD',
  }).optional(),
  countryId: Joi.number().integer().greater(-1).optional(),
});

const eventBookingCheckoutSchema = Joi.object({
  id: Joi.number().integer().greater(0).optional(),
  eventId: Joi.number().integer().greater(0).required(),
  token: Joi.string()
    .messages({
      'any.required': 'TOKEN_REQUIRED',
      'string.base': 'TOKEN_REQUIRED',
      'string.empty': 'TOKEN_REQUIRED',
    }).required(),
});

const bookingCancellationSchema = Joi.object({
  id: Joi.number().integer().greater(0).optional(),
  reason: Joi.string().optional(),
});

export default {
  addBookingSchema,
  bookingCheckoutSchema,
  addEventBookingSchema,
  eventBookingCheckoutSchema,
  bookingCancellationSchema,
};
