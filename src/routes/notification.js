import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';

const router = Router();
const { authMiddleware, resourceAccessMiddleware, notificationMiddleware } = middlewares;
const { notificationController } = controllers;

router.get(
  '/notification-list',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  notificationController.notificationList,
);

router.put(
  '/notification/update-read-status',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  notificationMiddleware.checkNotificationExists,
  notificationController.updateReadStatus,
);

router.get(
  '/notification/unread-count',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  notificationController.notificationUnReadCount,
);

export default router;
