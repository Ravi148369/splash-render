import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { ownerPageSettingValidator } = validations;
const { ownerPageSettingController } = controllers;
const { authMiddleware, resourceAccessMiddleware, validateMiddleware } = middlewares;

router.post(
  '/admin/owner-page-setting',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({
    schema: ownerPageSettingValidator.addOwnerPageSettingSchema,
  }),
  ownerPageSettingController.addOwnerPageSetting,
);

router.get(
  '/admin/owner-page-setting',
  ownerPageSettingController.getOwnerPageSetting,
);

export default router;
