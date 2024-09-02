import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { popularLocationValidator } = validations;
const { popularLocationController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  popularLocationMiddleware,
} = middlewares;

router.post(
  '/admin/popular-location',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  popularLocationMiddleware.duplicatePopularLocationExists,
  validateMiddleware({
    schema: popularLocationValidator.addAndUpdatePopularLocationSchema,
  }),
  popularLocationController.addPopularLocation,
);

router.get(
  '/admin/popular-location',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  popularLocationController.getPopularLocations,
);

router.get(
  '/user/popular-location',
  popularLocationController.getUserPopularLocations,
);

router.get(
  '/admin/popular-location/:id',
  authMiddleware,
  popularLocationMiddleware.checkPopularLocationExists,
  popularLocationController.getPopularLocationDetail,
);

router.put(
  '/admin/popular-location/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  popularLocationMiddleware.checkPopularLocationExists,
  popularLocationMiddleware.duplicatePopularLocationExists,
  validateMiddleware({
    schema: popularLocationValidator.addAndUpdatePopularLocationSchema,
  }),
  popularLocationController.updatePopularLocation,
);

router.put(
  '/admin/popular-location/:id/change-status',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  popularLocationMiddleware.checkPopularLocationExists,
  validateMiddleware({
    schema: popularLocationValidator.UpdatePopularLocationStatusSchema,
  }),
  popularLocationController.updatePopularLocationStatus,
);

router.delete(
  '/admin/popular-location/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  popularLocationMiddleware.checkPopularLocationExists,
  popularLocationController.deletePopularLocation,
);

export default router;
