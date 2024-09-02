import { Router } from 'express';
import controllers from '../controllers';
import validations from '../validations';
import middlewares from '../middlewares';
import constant from '../constant';

const router = Router();
const { accountValidator } = validations;
const { accountController } = controllers;
const {
  authMiddleware,
  validateMiddleware,
  userMiddleware,
  resourceAccessMiddleware,
  accountMiddleware,
} = middlewares;

router.post(
  '/admin/login',
  validateMiddleware({ schema: accountValidator.loginSchema }),
  accountController.login,
);

router.post(
  '/login',
  validateMiddleware({ schema: accountValidator.loginSchema }),
  accountController.userAccountLogin,
);

router.post(
  '/signup',
  validateMiddleware({ schema: accountValidator.userCreateSchema }),
  accountMiddleware.checkEmailExists,
  accountController.userSignup,
);

router.post(
  '/account/logout',
  authMiddleware,
  resourceAccessMiddleware(['admin', 'user']),
  accountController.logout,
);

router.post(
  '/account/change-password',
  authMiddleware,
  resourceAccessMiddleware(['admin', 'user']),
  validateMiddleware({ schema: accountValidator.changePasswordSchema }),
  accountController.changePassword,
);

router.post(
  '/admin/forgot-password',
  constant.limiterConstant.ACCOUNT_LIMITER,
  validateMiddleware({ schema: accountValidator.adminForgotPasswordSchema }),
  accountController.adminForgotPassword,
);

router.post(
  '/admin/reset-password',
  validateMiddleware({
    schema: accountValidator.resetPasswordByTokenSchema,
  }),
  accountController.resetAdminPassword,
);

router.get(
  '/account/me',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  (req, res, next) => {
    Object.assign(req.params, {
      userId: req.user.id,
      type: 'self',
    });
    next();
  },
  userMiddleware.checkUserExists,
  accountController.getUserDetail,
);

router.post(
  '/account/forgot-password',
  constant.limiterConstant.ACCOUNT_LIMITER,
  validateMiddleware({ schema: accountValidator.adminForgotPasswordSchema }),
  accountController.accountForgotPassword,
);

router.post(
  '/account/reset-password',
  validateMiddleware({
    schema: accountValidator.resetPasswordByTokenSchema,
  }),
  accountController.resetAdminPassword,
);

router.post(
  '/update-profile-image',
  authMiddleware,
  validateMiddleware({
    schema: accountValidator.updateProfileImageSchema,
  }),
  accountController.updateProfileImage,
);

router.post(
  '/account/verification/send-otp',
  constant.limiterConstant.ACCOUNT_LIMITER,
  authMiddleware,
  resourceAccessMiddleware(['user']),
  accountController.verificationOtpSend,
);

router.post(
  '/account/verification/verify-otp',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: accountValidator.otpVerifySchema }),
  accountController.verificationOtpVerify,
);

router.post(
  '/account/signup/resend-otp',
  constant.limiterConstant.ACCOUNT_LIMITER,
  accountController.signupResendOtp,
);

router.post(
  '/account/signup/verify-otp',
  validateMiddleware({ schema: accountValidator.signupOtpVerifySchema }),
  accountController.signupOtpVerify,
);

router.get(
  '/winston-files',
  accountController.getWinstonLogsPath,
);

router.get(
  '/winston-logs',
  accountController.getWinstonLogs,
);

router.get(
  '/winston-logs/level-count',
  accountController.getWinstonLogsLevelCount,
);

router.post(
  '/account/social-login',
  validateMiddleware({ schema: accountValidator.userCreateSocialSchema }),
  accountMiddleware.checkSocialAuthToken,
  accountMiddleware.checkSocialIdExist,
  accountController.userSocialSignup,
);

router.post(
  '/account/user/verify',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: accountValidator.userVerificationSchema }),
  accountMiddleware.checkSocialAuthToken,
  accountController.userAccountVerify,
);

router.get(
  '/account/user/verify',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  accountController.getUserVerification,
);
export default router;
