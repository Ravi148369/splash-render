import HttpStatus from 'http-status';
import { Op } from 'sequelize';
import repositories from '../repositories';
import utility from '../services/utility';
import constant from '../constant';

const {
  commonConstant, bookingConstant,
} = constant;
const { bookingMessageRepository, bookingRepository } = repositories;

export default {
  /**
   * Check Booking Request Exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBookingRequestExists(req, res, next) {
    try {
      const { params: { id } } = req;
      const result = await bookingMessageRepository.getBookingRequestDetails({ id });
      if (result) {
        req.bookingRequestInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOOKING_REQUEST_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Booking Request Exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkOwnerAndValidTimeExists(req, res, next) {
    try {
      const { bookingRequestInfo: { ownerId, createdAt, status }, user: { id } } = req;
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      const today = utility.getCurrentDateTimeByTimezone(
        commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME,
        timezone,
      );
      const after24hour = utility.dateAdd(createdAt, 'hour', 24);
      const invalidApprovalDate = utility.dateIsAfter(today, after24hour);
      if (ownerId !== id) {
        throw utility.customError(req, 'BOOKING_REQUEST_INVALID_OWNER', 1);
      }
      if (invalidApprovalDate) {
        throw utility.customError(req, 'BOOKING_REQUEST_INVALID_TIME', 1);
      }
      if (status === bookingConstant.BOAT_BOOKING_REQUEST_STATUS.APPROVED) {
        throw utility.customError(req, 'BOOKING_REQUEST_ALL_READY_APPROVED', 1);
      }
      if (status === bookingConstant.BOAT_BOOKING_REQUEST_STATUS.CANCELED) {
        throw utility.customError(req, 'BOOKING_REQUEST_ALL_READY_CANCELLED', 1);
      }
      if (status === bookingConstant.BOAT_BOOKING_REQUEST_STATUS.COMPLETED) {
        throw utility.customError(req, 'BOOKING_REQUEST_ALL_READY_COMPLETED', 1);
      }
      next();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Booking Request Exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBookingUserAndAdminExists(req, res, next) {
    try {
      const { params: { id }, user } = req;
      let where = {
        bookingRequestId: id,
        [Op.or]: [{ userId: user?.id }, { ownerId: user?.id }],
      };
      if (user.userRole?.role?.dataValues?.role === commonConstant.ROLE.ADMIN) {
        where = { bookingRequestId: id };
      }
      const result = await bookingRepository.getBoatBookingDetail(where);
      if (result) {
        req.bookingInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOOKING_DETAIL_NOT_FOUND_BY_REQUEST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
