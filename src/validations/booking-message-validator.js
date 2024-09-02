import Joi from 'joi';

const addBookingRequestSchema = Joi.object({
  boatId: Joi.number().integer().greater(0).required(),
  duration: Joi.number().integer().greater(0).required(),
  bookingDate: Joi.date()
    .greater(Date.now() - 24 * 60 * 60 * 1000)
    .message('Invalid Booking date')
    .required(),
  startTime: Joi.string(),
  endTime: Joi.string(),
  message: Joi.string().required(),
});

const addBookingRequestMessageSchema = Joi.object({
  id: Joi.number().integer().greater(0).required(),
  message: Joi.string().required(),
});

export default {
  addBookingRequestSchema,
  addBookingRequestMessageSchema,
};
