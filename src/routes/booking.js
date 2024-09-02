import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { bookingValidator } = validations;
const { bookingController } = controllers;
const {
  authMiddleware, resourceAccessMiddleware, validateMiddleware,
  boatMiddleware, eventMiddleware, bookingMiddleware,
} = middlewares;

router.post(
  '/boat-booking',
  authMiddleware,
  resourceAccessMiddleware(['admin', 'user']),
  validateMiddleware({ schema: bookingValidator.addBookingSchema }),
  boatMiddleware.checkBoatExists,
  boatMiddleware.checkBoatBlocked,
  boatMiddleware.checkBookedSlot,
  bookingMiddleware.checkBookingActiveAndValidDate,
  bookingMiddleware.checkBookingRequestExists,
  bookingMiddleware.verifyBoatBookingAmount,
  bookingMiddleware.verifyBoatListed,
  bookingController.addBooking,
);

router.get(
  '/boat-booking',
  authMiddleware,
  resourceAccessMiddleware(['admin', 'user']),
  bookingController.bookingList,
);

router.post(
  '/boat-booking/:id/checkout',
  authMiddleware,
  resourceAccessMiddleware(['admin', 'user']),
  validateMiddleware({ schema: bookingValidator.bookingCheckoutSchema }),
  boatMiddleware.checkBoatExists,
  bookingMiddleware.checkBookingExistsForCheckout,
  boatMiddleware.checkBoatBlocked,
  boatMiddleware.checkBookedSlot,
  bookingController.bookingCheckout,
);

router.post(
  '/event-booking',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: bookingValidator.addEventBookingSchema }),
  eventMiddleware.checkEventExists,
  eventMiddleware.checkEventDateExists,
  bookingMiddleware.verifyEventBookingAmount,
  bookingMiddleware.verifyNumberOfAttendee,
  bookingController.addEventBooking,
);

router.post(
  '/event-booking/:id/checkout',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  eventMiddleware.checkEventExists,
  eventMiddleware.checkEventDateExists,
  validateMiddleware({ schema: bookingValidator.eventBookingCheckoutSchema }),
  bookingController.eventBookingCheckout,
);

router.get(
  '/event-booking/your-events',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  bookingController.getEventBookings,
);

router.get(
  '/your-trips',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  bookingController.getBoatBookings,
);

router.get(
  '/your-reservations',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  bookingController.getBoatReservations,
);

router.get(
  '/boat-booking/:id',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  bookingMiddleware.checkBoatBookingExists,
  bookingController.getBoatBookingDetail,
);

router.get(
  '/event-booking/:id',
  authMiddleware,
  resourceAccessMiddleware(['user', 'admin']),
  bookingMiddleware.checkEventBookingExists,
  bookingController.getEventBookingDetail,
);

router.put(
  '/boat-booking/:id/booking-cancellation',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: bookingValidator.bookingCancellationSchema }),
  bookingMiddleware.checkBoatBookingExists,
  bookingMiddleware.verifyBookingDateForCancelation,
  bookingController.bookingCancellation,
);

router.put(
  '/event-booking/:id/booking-cancellation',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: bookingValidator.bookingCancellationSchema }),
  bookingMiddleware.checkEventBookingAndCancelledExists,
  eventMiddleware.checkEventDateExists,
  bookingController.eventBookingCancellation,
);

router.post(
  '/boat-booking/:id/refund',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  bookingMiddleware.checkBookingStatusCancelled,
  bookingMiddleware.checkAlreadyRefunded,
  bookingController.bookingPaymentRefund,
);

router.post(
  '/boat-booking/:id/transfer',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  bookingMiddleware.checkBookingStatusCompleted,
  bookingMiddleware.checkAlreadyTransfer,
  bookingController.bookingAmountTransfer,
);

router.post(
  '/event-booking/:id/refund',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  bookingMiddleware.checkEventBookingStatusCancelled,
  bookingMiddleware.checkEventBookingAlreadyRefunded,
  bookingController.bookedEventPaymentRefund,
);

router.get(
  '/boat-booking/:id/calculate-refund-amount',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  bookingMiddleware.checkBookingStatusCancelled,
  bookingMiddleware.checkAlreadyRefunded,
  bookingController.calculateBookingRefundAmount,
);

router.get(
  '/event-booking/:id/calculate-refund-amount',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  bookingMiddleware.checkEventBookingStatusCancelled,
  bookingMiddleware.checkEventBookingAlreadyRefunded,
  bookingController.calculateEventBookingRefundAmount,
);

export default router;
