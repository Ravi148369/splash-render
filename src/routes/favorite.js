import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { favoriteValidator } = validations;
const { favoriteListController, favoriteBoatController, favoriteEventController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  favoriteMiddleware,
  boatMiddleware,
  eventMiddleware,
} = middlewares;

router.post(
  '/user/favorite-list',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: favoriteValidator.favoriteListSchema }),
  favoriteMiddleware.duplicateFavoriteListExists,
  favoriteListController.addFavoriteList,
);

router.get(
  '/user/favorite-list',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  favoriteListController.getFavoriteLists,
);

router.post(
  '/user/favorite-boat',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: favoriteValidator.favoriteBoatSchema }),
  favoriteMiddleware.checkFavoriteBoatExists,
  boatMiddleware.checkBoatExists,
  favoriteMiddleware.checkFavoriteListExists,
  favoriteBoatController.addFavoriteBoat,
);

router.post(
  '/user/favorite-event',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: favoriteValidator.favoriteEventSchema }),
  eventMiddleware.checkEventExists,
  favoriteMiddleware.checkFavoriteEventExists,
  favoriteEventController.addFavoriteEvent,
);

router.get(
  '/user/favorite-event',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  favoriteEventController.getFavoriteEvents,
);

router.put(
  '/user/favorite-list/:id',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: favoriteValidator.updateFavoriteListSchema }),
  favoriteMiddleware.checkFavoriteListExists,
  favoriteMiddleware.duplicateFavoriteListExists,
  favoriteListController.updateFavoriteList,
);

router.delete(
  '/user/favorite-list/:id',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  favoriteMiddleware.checkFavoriteListExists,
  favoriteListController.deleteFavoriteList,
);

export default router;
