import Joi from 'joi';

const addAdminReviewSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  boatId: Joi.number().integer().greater(-1).required(),
  content: Joi.string().required(),
});

const UpdateAdminReviewSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  boatId: Joi.number().integer().greater(-1).required(),
  content: Joi.string().required(),
});

const UpdateAdminReviewStatusSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  status: Joi.string().valid('active', 'inactive').required(),
});

const addReviewSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  boatId: Joi.number().integer().greater(-1).required(),
  bookingId: Joi.number().integer().optional(),
  content: Joi.string().required(),
});

export default {
  addAdminReviewSchema,
  UpdateAdminReviewSchema,
  addReviewSchema,
  UpdateAdminReviewStatusSchema,
};
