import Joi from 'joi';

const addBoatSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  typeId: Joi.number().integer().greater(0).required(),
  length: Joi.string().required(),
  makeId: Joi.number().integer().greater(0).required(),
  modelId: Joi.number().integer().greater(0).required(),
  numberOfPassenger: Joi.number().integer().greater(0).required(),
  yearId: Joi.number().integer().greater(0).required(),
  countryId: Joi.number().integer().greater(0).required(),
  stateId: Joi.number().integer().greater(0).required(),
  city: Joi.string().required(),
  streetAddress: Joi.string().required(),
  zipCode: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  boatFeatureIds: Joi.array().items().required(),
});

const addBoatImagesSchema = Joi.object({
  boatId: Joi.number().integer().required(),
  name: Joi.string().required(),
  description: Joi.string().min(30).required(),
  boatImages: Joi.array()
    .items(
      Joi.object().keys({
        cover_image: Joi.number().integer().required(),
        image: Joi.string().required(),
      }),
    )
    .required(),
});

const addBoatBookingDetailSchema = Joi.object({
  boatId: Joi.number().integer().required(),
  boatRuleIds: Joi.array().items().required(),
  cancellationPolicy: Joi.string()
    .valid('flexible', 'moderate', 'strict', 'super strict')
    .required(),
  status: Joi.string().valid('pending', 'completed').required(),
  boatPrices: Joi.array()
    .items(
      Joi.object().keys({
        duration: Joi.number().required(),
        amount: Joi.number().integer().greater(0).required(),
      }),
    )
    .required(),
  currency: Joi.string().required(),
  // boatAvailable: Joi.array().items(Joi.object().keys({
  //   startDate: Joi.string().required(),
  //   endDate: Joi.string().required(),
  // })).required(),
  boatBlockDates: Joi.array().items().required(),
});

const updateBoatStatusSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  status: Joi.string().valid('listed', 'unlisted').required(),
});

const boatRecommendSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  isRecommended: Joi.number().integer().greater(-1).less(2)
    .required(),
});

const boatBookingSchema = Joi.object({
  id: Joi.number().integer().greater(-1).optional()
    .empty()
    .allow(null),
  isBooking: Joi.number().integer().greater(-1).less(2)
    .required(),
});

export default {
  addBoatSchema,
  addBoatImagesSchema,
  addBoatBookingDetailSchema,
  updateBoatStatusSchema,
  boatRecommendSchema,
  boatBookingSchema,
};
