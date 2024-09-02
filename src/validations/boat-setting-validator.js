import Joi from 'joi';

const addUpdateBoatTypeSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  name: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive').allow(null),
});

const addUpdateBoatMakeSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  name: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive').allow(null),
});

const addUpdateBoatYearSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  year: Joi.number().integer().less(new Date().getFullYear() + 1).required(),
  status: Joi.string().valid('active', 'inactive').allow(null),
});

const addUpdateBoatFeatureSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  name: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive').allow(null),
});

const addUpdateBoatRuleSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  name: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive').allow(null),
});

const addBoatModelSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  name: Joi.string().required(),
  makeId: Joi.number().integer().greater(0).required(),
  status: Joi.string().valid('active', 'inactive').allow(null),
});

const updateBoatModelSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  name: Joi.string().required(),
  status: Joi.string().valid('active', 'inactive').allow(null),
});

export default {
  addUpdateBoatTypeSchema,
  addUpdateBoatMakeSchema,
  addUpdateBoatYearSchema,
  addUpdateBoatFeatureSchema,
  addUpdateBoatRuleSchema,
  addBoatModelSchema,
  updateBoatModelSchema,
};
