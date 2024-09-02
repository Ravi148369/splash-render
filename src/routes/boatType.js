import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { boatSettingValidator } = validations;
const { boatTypeController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  boatSettingMiddleware,
} = middlewares;

router.post(
  '/boat-setting/boat-type',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatSettingMiddleware.duplicateBoatTypeExists,
  validateMiddleware({ schema: boatSettingValidator.addUpdateBoatTypeSchema }),
  boatTypeController.addBoatType,
);

router.get(
  '/boat-setting/boat-type',
  boatTypeController.getBoatTypes,
);

router.get(
  '/boat-setting/boat-type/:id',
  authMiddleware,
  boatSettingMiddleware.checkBoatTypeExists,
  boatTypeController.getBoatTypeDetail,
);

router.put(
  '/boat-setting/boat-type/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatSettingMiddleware.checkBoatTypeExists,
  boatSettingMiddleware.duplicateBoatTypeExists,
  validateMiddleware({ schema: boatSettingValidator.addUpdateBoatTypeSchema }),
  boatTypeController.updateBoatType,
);

export default router;
