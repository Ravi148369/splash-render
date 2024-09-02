import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { boatSettingValidator } = validations;
const { boatFeatureController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  boatSettingMiddleware,
} = middlewares;

router.post(
  '/boat-setting/boat-feature',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatSettingMiddleware.duplicateBoatFeatureExists,
  validateMiddleware({
    schema: boatSettingValidator.addUpdateBoatFeatureSchema,
  }),
  boatFeatureController.addBoatFeature,
);

router.get(
  '/boat-setting/boat-feature',
  authMiddleware,
  boatFeatureController.getBoatFeatures,
);

router.get(
  '/boat-setting/boat-feature/:id',
  authMiddleware,
  boatSettingMiddleware.checkBoatFeatureExists,
  boatFeatureController.getBoatFeatureDetail,
);

router.put(
  '/boat-setting/boat-feature/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatSettingMiddleware.checkBoatFeatureExists,
  boatSettingMiddleware.duplicateBoatFeatureExists,
  validateMiddleware({
    schema: boatSettingValidator.addUpdateBoatFeatureSchema,
  }),
  boatFeatureController.updateBoatFeature,
);

export default router;
