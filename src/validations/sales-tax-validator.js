import Joi from 'joi';

const addSalesTaxSchema = Joi.object({
  id: Joi.number().integer().greater(0).optional(),
  zipCode: Joi.string(),
  salesTax: Joi.string(),
});

const updateSalesTaxSchema = Joi.object({
  id: Joi.number().integer().greater(0),
  zipCode: Joi.string(),
  salesTax: Joi.number().integer(),
})

export default {
  addSalesTaxSchema,
  updateSalesTaxSchema
};

