import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { boatSettingValidator } = validations;
const { boatModelController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  boatSettingMiddleware,
} = middlewares;

router.post(
  '/boat-setting/boat-model',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({ schema: boatSettingValidator.addBoatModelSchema }),
  boatModelController.addBoatModel,
);

router.get(
  '/boat-setting/boat-model',
  authMiddleware,
  boatModelController.getBoatModels,
);

router.get(
  '/boat-setting/boat-model/:id',
  authMiddleware,
  boatSettingMiddleware.checkBoatModelExists,
  boatModelController.getBoatModelDetail,
);

router.put(
  '/boat-setting/boat-model/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatSettingMiddleware.checkBoatModelExists,
  validateMiddleware({ schema: boatSettingValidator.updateBoatModelSchema }),
  boatModelController.updateBoatModel,
);

export default router;
