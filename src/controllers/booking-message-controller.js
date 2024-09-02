import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { bookingMessageRepository } = repositories;

export default {
  /**
     * Add Booking Request
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     */
  async addBookingRequest(req, res, next) {
    try {
      const result = await bookingMessageRepository.addBookingRequest(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOOKING_REQUEST_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
     * Add Boat Booking Request Message
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     */
  async addBookingRequestMessage(req, res, next) {
    try {
      const result = await bookingMessageRepository.addBookingRequestMessage(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOOKING_REQUEST_MESSAGE_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
     * Get Booking Request list
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     */
  async getBookingRequest(req, res, next) {
    try {
      const result = await bookingMessageRepository.getBookingRequest(req);
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
   * Get Booking Request Detail
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBookingRequestDetail(req, res, next) {
    try {
      const { bookingRequestInfo } = req;
      res.status(HttpStatus.OK).json({
        success: true,
        data: bookingRequestInfo,
        message: utility.getMessage(req, false, 'BOOKING_REQUEST_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
     * Get Booking Request Message list
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     */
  async getBookingMessageRequest(req, res, next) {
    try {
      const result = await bookingMessageRepository.getBookingRequestMessage(req);
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
   * Update booking request status
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateBookingRequestStatus(req, res, next) {
    try {
      const result = await bookingMessageRepository.updateBookingRequestStatus(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BOOKING_REQUEST_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
     * Get Booking details by request id
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     */
  async getBookingDetailByRequestId(req, res, next) {
    try {
      const { bookingInfo } = req;
      res.status(HttpStatus.OK).json({
        success: true,
        data: bookingInfo,
        message: utility.getMessage(req, false, 'BOOKING_DETAIL_FOUND_BY_REQUEST'),
      });
    } catch (error) {
      next(error);
    }
  },

};
