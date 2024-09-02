import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { bankAccountValidator } = validations;
const { bankAccountController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
} = middlewares;

router.post(
  '/bank-account',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: bankAccountValidator.addBankAccountSchema }),
  bankAccountController.addBankAccount,
);

router.get(
  '/bank-account',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  bankAccountController.getBankAccount,
);

router.get(
  '/transaction',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  bankAccountController.transactionList,
);
export default router;
