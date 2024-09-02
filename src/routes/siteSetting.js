import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { siteSettingValidator } = validations;
const { siteSettingController } = controllers;
const { authMiddleware, resourceAccessMiddleware, validateMiddleware } = middlewares;

router.post(
  '/site-setting',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({
    schema: siteSettingValidator.addSiteSettingSchema,
  }),
  siteSettingController.addSiteSetting,
);

router.get(
  '/site-setting',
  siteSettingController.getSiteSetting,
);

export default router;
