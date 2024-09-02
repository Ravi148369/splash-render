import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { bookingMessageValidator } = validations;
const { bookingMessageController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  boatMiddleware,
  bookingMessageMiddleware,
} = middlewares;

router.post(
  '/booking-request',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: bookingMessageValidator.addBookingRequestSchema }),
  boatMiddleware.checkBoatExists,
  boatMiddleware.checkBoatBlocked,
  boatMiddleware.checkBookedSlot,
  bookingMessageController.addBookingRequest,
);

router.post(
  '/booking-request/:id/message',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: bookingMessageValidator.addBookingRequestMessageSchema }),
  bookingMessageMiddleware.checkBookingRequestExists,
  bookingMessageController.addBookingRequestMessage,
);

router.get(
  '/booking-request/:id/message',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  bookingMessageMiddleware.checkBookingRequestExists,
  bookingMessageController.getBookingMessageRequest,
);

router.get(
  '/booking-request',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  bookingMessageController.getBookingRequest,
);

router.get(
  '/booking-request/:id',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  bookingMessageMiddleware.checkBookingRequestExists,
  bookingMessageController.getBookingRequestDetail,
);

router.put(
  '/booking-request/:id/approval',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  bookingMessageMiddleware.checkBookingRequestExists,
  bookingMessageMiddleware.checkOwnerAndValidTimeExists,
  bookingMessageController.updateBookingRequestStatus,
);

router.get(
  '/booking-request/:id/booking',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  bookingMessageMiddleware.checkBookingRequestExists,
  bookingMessageMiddleware.checkBookingUserAndAdminExists,
  bookingMessageController.getBookingDetailByRequestId,
);

export default router;
