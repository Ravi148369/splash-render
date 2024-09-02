import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { aboutUsPageSettingValidator } = validations;
const { aboutUsPageSettingController } = controllers;
const { authMiddleware, resourceAccessMiddleware, validateMiddleware } = middlewares;

router.post(
  '/admin/about-us-page-setting',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({
    schema: aboutUsPageSettingValidator.addAboutUsPageSettingSchema,
  }),
  aboutUsPageSettingController.addAboutUsPageSetting,
);

router.get(
  '/admin/about-us-page-setting',
  aboutUsPageSettingController.getAboutUsPageSetting,
);

export default router;
