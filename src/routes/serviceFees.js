import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { serviceFeesValidator } = validations;
const { serviceFeesController } = controllers;
const { authMiddleware, resourceAccessMiddleware, validateMiddleware } = middlewares;

router.post(
  '/admin/service-fees',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({
    schema: serviceFeesValidator.addServiceFeesSchema,
  }),
  serviceFeesController.addServiceFees,
);

router.get(
  '/admin/service-fees',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  serviceFeesController.getServiceFees,
);

router.get(
  '/service-fees',
  authMiddleware,
  resourceAccessMiddleware(['admin', 'user']),
  serviceFeesController.getServiceFees,
);

export default router;
