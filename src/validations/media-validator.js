import Joi from 'joi';

const uploadSchema = Joi.object({
  mediaFor: Joi.string()
    .valid(
      'user',
      'banner',
      'staticBlock',
      'admin',
      'popularLocation',
      'boat',
      'blog',
      'userDocument',
      'ownerPage',
      'aboutUsPage',
      'event',
    )
    .messages({
      'any.only': 'MEDIA_FOR_REQUIRED',
    })
    .required(),
  mediaType: Joi.string()
    .valid('image', 'video', 'file')
    .messages({
      'any.only': 'MEDIA_TYPE_REQUIRED',
    })
    .required(),
  apiName: Joi.string().optional().empty().allow(''),
});

export default {
  uploadSchema,
};
