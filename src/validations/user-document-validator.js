import Joi from 'joi';

const addAndUpdateUserDocumentSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  userDocument: Joi.string().required(),
  userId: Joi.number().integer().greater(-1).required(),
  status: Joi.string().valid('pending'),
});

const UpdateUserDocumentStatusSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  status: Joi.string().valid('approve', 'reject'),
});

export default {
  addAndUpdateUserDocumentSchema,
  UpdateUserDocumentStatusSchema,
};
