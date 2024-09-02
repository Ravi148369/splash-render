import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { userController } = controllers;
const { userValidator } = validations;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  userMiddleware,
} = middlewares;

router.put(
  '/update-profile',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: userValidator.userProfileUpdateSchema }),
  userMiddleware.checkEmailExists,
  userMiddleware.checkPhoneNumberExists,
  userController.updateProfile,
);

router.get(
  '/payment-setting',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  userController.getPaymentSetting,
);

router.get(
  '/profile-completion',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  userController.getProfileCompletion,
);

router.get(
  '/owner/:id',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  userMiddleware.VerifyUserOwnerExist,
  userController.getOwnerDetail,
);

export default router;
