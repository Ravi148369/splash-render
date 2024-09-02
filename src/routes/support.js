import { Router } from 'express';
import controllers from '../controllers';
import validations from '../validations';
import middlewares from '../middlewares';
import constant from '../constant';

const router = Router();
const { supportValidator } = validations;
const { supportController } = controllers;
const {
  validateMiddleware,
} = middlewares;

router.post(
  '/contact-support',
  constant.limiterConstant.ACCOUNT_LIMITER,
  validateMiddleware({ schema: supportValidator.contactAndSupportSchema }),
  supportController.addSupportEmail,
);
export default router;
