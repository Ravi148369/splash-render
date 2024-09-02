import Joi from 'joi';

const addEventSchema = Joi.object({
  boatId: Joi.number().integer().required(),
  name: Joi.string().required(),
  eventType: Joi.string().required(),
  location: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  eventDate: Joi.date()
    .greater(Date.now())
    .message({ 'date.greater': 'EVENT_INVALID_DATE' })
    .required(),
  numberOfAttendee: Joi.number().integer().greater(0).required(),
  hostedBy: Joi.string().required(),
  adultPrice: Joi.number().greater(-1).required(),
  childrenPrice: Joi.number().greater(-1).required(),
  currency: Joi.string().required(),
  description: Joi.string(),
  eventImages: Joi.array()
    .items(
      Joi.object().keys({
        cover_image: Joi.number().integer().required(),
        image: Joi.string().required(),
      }),
    )
    .required(),
});

const updateEventSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  boatId: Joi.number().integer().required(),
  name: Joi.string().required(),
  eventType: Joi.string().required(),
  location: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  eventDate: Joi.date()
    .greater(Date.now())
    .message({ 'date.greater': 'EVENT_INVALID_DATE' })
    .required(),
  prevEventDate: Joi.date()
    .greater(Date.now())
    .message({ 'date.greater': 'EVENT_INVALID_DATE' })
    .required(),
  numberOfAttendee: Joi.number().integer().greater(0).required(),
  hostedBy: Joi.string().required(),
  adultPrice: Joi.number().greater(-1).required(),
  childrenPrice: Joi.number().greater(-1).required(),
  currency: Joi.string().required(),
  description: Joi.string(),
  eventImages: Joi.array()
    .items(
      Joi.object().keys({
        cover_image: Joi.number().integer().required(),
        image: Joi.string().required(),
      }),
    )
    .required(),
});

export default {
  addEventSchema,
  updateEventSchema,
};
