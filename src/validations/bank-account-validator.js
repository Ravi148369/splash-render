import Joi from 'joi';

const addBankAccountSchema = Joi.object({
  bankName: Joi.string().label('Bank Name').trim().min(2)
    .max(50)
    .optional(),
  bankLocation: Joi.string().trim().min(2).max(200)
    .optional(),
  accountNumber: Joi.string()
    .label('Bank Account Number')
    .min(9)
    .max(16)
    .required(),
  routingNumber: Joi.string().min(9).max(16).required(),
  accountHolderName: Joi.string()
    .label('Bank Account Holder Name')
    .trim()
    .min(2)
    .max(50)
    .required(),
  email: Joi.string().label('Email').trim().email()
    .min(1)
    .max(190)
    .optional(),
  dateOfBirth: Joi.date()
    .messages({
      'date.format': 'DATE_OF_BIRTH_FORMAT',
      'any.required': 'DATE_REQUIRED',
    })
    .required(),
  addressLine1: Joi.string().min(2).max(50).required(),
  city: Joi.string().min(2).max(30).required(),
  stateId: Joi.number().integer().required(),
  postalCode: Joi.string().min(2).max(30).required(),
  countryId: Joi.number().integer().required(),
  phone: Joi.string().min(2).max(16).required(),
  ssn: Joi.string().max(4).required(),
  taxClassification: Joi.string().required(),
});

export default {
  addBankAccountSchema,
};
