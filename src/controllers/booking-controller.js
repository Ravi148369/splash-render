import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { bookingRepository } = repositories;

export default {
  /**
   * Add Boat Booking
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBooking(req, res, next) {
    try {
      const result = await bookingRepository.addBooking(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOOKING_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get booking list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async bookingList(req, res, next) {
    try {
      const result = await bookingRepository.bookingList(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOOKING_LIST'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add Boat Booking payment checkout
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async bookingCheckout(req, res, next) {
    try {
      const result = await bookingRepository.bookingCheckout(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOOKING_PAYMENT_UPDATE'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add Event Booking
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addEventBooking(req, res, next) {
    try {
      const result = await bookingRepository.addEventBooking(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'EVENT_BOOKING_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add Event Booking payment checkout
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async eventBookingCheckout(req, res, next) {
    try {
      const result = await bookingRepository.eventBookingCheckout(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'EVENT_BOOKING_PAYMENT_UPDATE'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all user's Event Booking list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getEventBookings(req, res, next) {
    try {
      const result = await bookingRepository.getEventBookings(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: '',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all user's boat Booking list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBoatBookings(req, res, next) {
    try {
      const result = await bookingRepository.getBoatBookings(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: '',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all user's boat Reservation list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBoatReservations(req, res, next) {
    try {
      const result = await bookingRepository.getBoatReservations(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: '',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Boat booking for itinerary and receipt detail
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBoatBookingDetail(req, res, next) {
    try {
      const { boatBookingInfo } = req;
      res.status(HttpStatus.OK).json({
        success: true,
        data: boatBookingInfo,
        message: utility.getMessage(req, false, 'BOOKING_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Event booking for itinerary and receipt detail
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getEventBookingDetail(req, res, next) {
    try {
      const { eventBookingInfo } = req;
      res.status(HttpStatus.OK).json({
        success: true,
        data: eventBookingInfo,
        message: utility.getMessage(req, false, 'EVENT_BOOKING_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Boat Booking Cancellation
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async bookingCancellation(req, res, next) {
    try {
      const result = await bookingRepository.bookingCancellation(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BOOKING_CANCELLATION'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Event Booking Cancellation
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async eventBookingCancellation(req, res, next) {
    try {
      const result = await bookingRepository.eventBookingCancellation(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'EVENT_BOOKING_CANCELLATION'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Booking Cancellation payment refund
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async bookingPaymentRefund(req, res, next) {
    try {
      const result = await bookingRepository.bookingPaymentRefund(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'PAYMENT_REFUNDED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Booking Amount transfer
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async bookingAmountTransfer(req, res, next) {
    try {
      const result = await bookingRepository.bookingAmountTransfer(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'PAYMENT_TRANSFERRED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Event Booking Cancellation payment refund
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async bookedEventPaymentRefund(req, res, next) {
    try {
      const result = await bookingRepository.bookedEventPaymentRefund(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'PAYMENT_REFUNDED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Calculation booking cancellation refund amount
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async calculateBookingRefundAmount(req, res, next) {
    try {
      const result = await bookingRepository.calculateBookingRefundAmount(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'CALCULATED_BOOKING_REFUND_AMOUNT'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Calculation event booking cancellation refund amount
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async calculateEventBookingRefundAmount(req, res, next) {
    try {
      const result = await bookingRepository.calculateEventBookingRefundAmount(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'CALCULATED_EVENT_BOOKING_REFUND_AMOUNT'),
      });
    } catch (error) {
      next(error);
    }
  },
};
