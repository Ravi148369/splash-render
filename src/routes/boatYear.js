import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { boatSettingValidator } = validations;
const { boatYearController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  boatSettingMiddleware,
} = middlewares;

router.post(
  '/boat-setting/boat-year',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatSettingMiddleware.duplicateBoatYearExists,
  validateMiddleware({ schema: boatSettingValidator.addUpdateBoatYearSchema }),
  boatYearController.addBoatYear,
);

router.get(
  '/boat-setting/boat-year',
  authMiddleware,
  boatYearController.getBoatYears,
);

router.get(
  '/boat-setting/boat-year/:id',
  authMiddleware,
  boatSettingMiddleware.checkBoatYearExists,
  boatYearController.getBoatYearDetail,
);

router.put(
  '/boat-setting/boat-year/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatSettingMiddleware.checkBoatYearExists,
  boatSettingMiddleware.duplicateBoatYearExists,
  validateMiddleware({ schema: boatSettingValidator.addUpdateBoatYearSchema }),
  boatYearController.updateBoatYear,
);

export default router;
