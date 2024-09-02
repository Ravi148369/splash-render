import Joi from 'joi';

const addReportSchema = Joi.object({
  id: Joi.number().integer().greater(0).optional()
    .empty()
    .allow(null),
  toUserId: Joi.number().integer().greater(0).required(),
  reportedType: Joi.string().required(),
});

export default {
  addReportSchema,
};
