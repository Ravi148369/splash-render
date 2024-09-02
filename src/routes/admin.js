import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { accountValidator } = validations;
const { adminController } = controllers;
const {
  authMiddleware,
  userMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
} = middlewares;

router.put(
  '/admin/update-profile',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({ schema: accountValidator.adminProfileUpdateSchema }),
  adminController.updateProfile,
);

router.get(
  '/admin/users',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  adminController.getUsers,
);

router.get(
  '/admin/users/:userId',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  userMiddleware.checkUserExists,
  adminController.getUserDetail,
);

router.put(
  '/admin/users/:userId/change-status',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({
    schema: accountValidator.changeStatusSchema,
  }),
  userMiddleware.checkUserExists,
  adminController.changeStatus,
);

router.get(
  '/admin/dashboard',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  adminController.getDashboardDetail,
);
export default router;
