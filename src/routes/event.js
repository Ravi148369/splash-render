import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { eventValidator } = validations;
const { eventController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  eventMiddleware,
} = middlewares;

router.post(
  '/event',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({ schema: eventValidator.addEventSchema }),
  eventMiddleware.checkEventBoatExists,
  eventController.addEvent,
);

router.get('/event', eventController.getEvents);

router.get(
  '/event/:id',
  // authMiddleware,
  eventMiddleware.checkEventExists,
  eventController.getEventDetail,
);
router.put(
  '/event/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({ schema: eventValidator.updateEventSchema }),
  eventMiddleware.checkEventExists,
  eventMiddleware.verifyNumberOfAttendee,
  eventMiddleware.checkBoatBlocked,
  eventController.updateEvent,
);

router.put('/event/:id/event-cancellation',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  eventMiddleware.checkEventExists,
  eventController.cancelEvent
)

router.get(
  '/event-transaction',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  eventController.getEventBookingTransaction,
);

export default router;
