import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { boatSettingValidator } = validations;
const { boatMakeController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  boatSettingMiddleware,
} = middlewares;

router.post(
  '/boat-setting/boat-make',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatSettingMiddleware.duplicateBoatMakeExists,
  validateMiddleware({ schema: boatSettingValidator.addUpdateBoatMakeSchema }),
  boatMakeController.addBoatMake,
);

router.get(
  '/boat-setting/boat-make',
  authMiddleware,
  boatMakeController.getBoatMakes,
);

router.get(
  '/boat-setting/boat-make/:id',
  authMiddleware,
  boatSettingMiddleware.checkBoatMakeExists,
  boatMakeController.getBoatMakeDetail,
);

router.put(
  '/boat-setting/boat-make/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatSettingMiddleware.checkBoatMakeExists,
  boatSettingMiddleware.duplicateBoatMakeExists,
  validateMiddleware({ schema: boatSettingValidator.addUpdateBoatMakeSchema }),
  boatMakeController.updateBoatMake,
);

export default router;
