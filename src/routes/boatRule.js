import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { boatSettingValidator } = validations;
const { boatRuleController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  boatSettingMiddleware,
} = middlewares;

router.post(
  '/boat-setting/boat-rule',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatSettingMiddleware.duplicateBoatRuleExists,
  validateMiddleware({ schema: boatSettingValidator.addUpdateBoatRuleSchema }),
  boatRuleController.addBoatRule,
);

router.get(
  '/boat-setting/boat-rule',
  authMiddleware,
  boatRuleController.getBoatRules,
);

router.get(
  '/boat-setting/boat-rule/:id',
  authMiddleware,
  boatSettingMiddleware.checkBoatRuleExists,
  boatRuleController.getBoatRuleDetail,
);

router.put(
  '/boat-setting/boat-rule/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatSettingMiddleware.checkBoatRuleExists,
  boatSettingMiddleware.duplicateBoatRuleExists,
  validateMiddleware({ schema: boatSettingValidator.addUpdateBoatRuleSchema }),
  boatRuleController.updateBoatRule,
);

export default router;
