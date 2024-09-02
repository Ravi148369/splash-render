import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { boatValidator } = validations;
const { boatController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  boatMiddleware,
} = middlewares;

router.post(
  '/boat',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: boatValidator.addBoatSchema }),
  boatController.addBoat,
);

router.get(
  '/boat',
  // authMiddleware,
  // resourceAccessMiddleware(['admin', 'user']),
  boatController.boatList,
);

router.get(
  '/manage-boat-list',
  authMiddleware,
  resourceAccessMiddleware(['admin', 'user']),
  boatController.manageBoatList,
);

router.get(
  '/boat/:id',
  // authMiddleware,
  // resourceAccessMiddleware(['admin', 'user']),
  boatMiddleware.checkBoatExists,
  boatController.boatDetail,
);

router.put(
  '/boat/:id',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: boatValidator.addBoatSchema }),
  boatMiddleware.checkBoatExists,
  boatMiddleware.checkValidFeatureIds,
  boatMiddleware.checkBoatOwner,
  boatController.updateBoat,
);

router.post(
  '/boat/images',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: boatValidator.addBoatImagesSchema }),
  boatMiddleware.checkBoatNameExists,
  boatMiddleware.checkBoatExists,
  boatMiddleware.checkBoatOwner,
  boatController.addBoatImages,
);

router.post(
  '/boat/detail',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: boatValidator.addBoatBookingDetailSchema }),
  boatMiddleware.checkBoatExists,
  boatMiddleware.checkBoatOwner,
  boatController.addBoatDetail,
);

router.put(
  '/boat/:id/change-status',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({ schema: boatValidator.updateBoatStatusSchema }),
  boatMiddleware.checkBoatExists,
  boatMiddleware.checkBoatStatus,
  // boatMiddleware.checkBoatOwner,
  boatController.updateBoatStatus,
);

router.put(
  '/boat/:id/recommend',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({ schema: boatValidator.boatRecommendSchema }),
  boatMiddleware.checkBoatExists,
  boatController.boatRecommend,
);

router.put(
  '/boat/:id/isBooking',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({ schema: boatValidator.boatBookingSchema }),
  boatMiddleware.checkBoatExists,
  boatController.boatIsBookingStatus,
);

router.get(
  '/boat-transaction',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  boatController.getBoatBookingTransaction,
);

router.delete(
  '/boat/:id',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  boatMiddleware.checkBoatExists,
  boatMiddleware.checkBoatOwner,
  boatMiddleware.verifyBoatStatusPending,
  boatController.deleteBoat,
);

export default router;
