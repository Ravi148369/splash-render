import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { reviewValidator } = validations;
const { reviewController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  reviewMiddleware,
  boatMiddleware,
} = middlewares;

router.post(
  '/admin/admin-review',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({ schema: reviewValidator.addAdminReviewSchema }),
  boatMiddleware.checkBoatExists,
  reviewController.addAdminReview,
);

router.post(
  '/user/review',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: reviewValidator.addReviewSchema }),
  boatMiddleware.checkBoatExists,
  reviewMiddleware.verifyUserForReview,
  reviewController.addUserReview,
);

router.get(
  '/user/review',
  authMiddleware,
  resourceAccessMiddleware(['admin', 'user']),
  reviewController.getUserAndBoatReviews,
);

router.get(
  '/admin/admin-review',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  reviewController.getAdminReviews,
);

router.get(
  '/admin/admin-review/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  reviewMiddleware.checkAdminReviewExists,
  reviewController.getAdminReviewDetail,
);

router.put(
  '/admin/admin-review/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  reviewMiddleware.checkAdminReviewExists,
  validateMiddleware({ schema: reviewValidator.UpdateAdminReviewSchema }),
  reviewController.updateAdminReview,
);

router.put(
  '/admin/admin-review/:id/change-status',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  reviewMiddleware.checkAdminReviewExists,
  validateMiddleware({ schema: reviewValidator.UpdateAdminReviewStatusSchema }),
  reviewController.updateAdminReviewStatus,
);

router.delete(
  '/admin/admin-review/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  reviewController.deleteAdminReview,
);

export default router;
