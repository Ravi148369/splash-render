import Joi from 'joi';

const addServiceFeesSchema = Joi.object({
  id: Joi.number().integer().greater(0).optional(),
  feesType: Joi.string().valid('percentage').optional(),
  renterFees: Joi.number().integer().greater(-1).required(),
  ownerFees: Joi.number().integer().greater(-1).required(),
  currency: Joi.string().required(),
});

export default {
  addServiceFeesSchema,
};
