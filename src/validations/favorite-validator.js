import Joi from 'joi';

const favoriteListSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  userId: Joi.number().integer().greater(-1).optional(),
  name: Joi.string().trim().max(50).required(),
  status: Joi.string().valid('active', 'inactive'),
});

const favoriteBoatSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  userId: Joi.number().integer().greater(-1).optional(),
  boatId: Joi.number().integer().greater(-1).required(),
  listId: Joi.number().integer().greater(-1).required(),
});

const favoriteEventSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  userId: Joi.number().integer().greater(-1).optional(),
  eventId: Joi.number().integer().greater(-1).required(),
});

const updateFavoriteListSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  name: Joi.string().trim().max(50).required(),
});

export default {
  favoriteListSchema,
  favoriteBoatSchema,
  favoriteEventSchema,
  updateFavoriteListSchema,
};
