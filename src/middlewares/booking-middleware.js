import HttpStatus from 'http-status';
import { Op } from 'sequelize';
import repositories from '../repositories';
import utility from '../services/utility';
import constant from '../constant';
import models from '../models';
import salesTaxRepository from '../repositories/sales-tax-repository';

const {
  bookingConstant, commonConstant, boatConstant,
} = constant;

const {
  bookingRepository, bookingMessageRepository, boatRepository, serviceFeesRepository,
  eventRepository,
} = repositories;

const {
  eventBooking,
} = models;

export default {
  /**
   * Check Boat Booking exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatBookingExists(req, res, next) {
    try {
      const { params: { id }, user } = req;
      let result;
      if (user.userRole?.role?.dataValues?.role === commonConstant.ROLE.ADMIN) {
        result = await bookingRepository.getBoatBookingDetail({ id });
      } else {
        result = await bookingRepository.getBoatBookingDetail({
          id,
          [Op.or]: [{ userId: user?.id }, { ownerId: user?.id }],
        });
      }
      if (result) {
        req.boatBookingInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOOKING_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Booking exist for checkout
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBookingExistsForCheckout(req, res, next) {
    try {
      const {
        body: {
          boatId,
        },
        params: { id },
      } = req;
      const searchCriteria = {
        id,
        boatId,
        paymentStatus: 'pending',
      };
      const result = await bookingRepository.getBoatBookingDetail(searchCriteria);
      if (result) {
        req.body.bookingDate = result.bookingDate;
        req.body.startTime = result.startTime;
        req.body.endTime = result.endTime;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOOKING_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Event Booking exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkEventBookingExists(req, res, next) {
    try {
      const { params: { id }, user } = req;
      let result;
      if (user.userRole?.role?.dataValues?.role === commonConstant.ROLE.ADMIN) {
        result = await bookingRepository.getEventBookingDetail({ id });
      } else {
        result = await bookingRepository.getEventBookingDetail({ id, userId: user?.id });
      }
      if (result) {
        req.eventBookingInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'EVENT_BOOKING_NOT_EXIST'),
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
  async checkBookingRequestExists(req, res, next) {
    try {
      const { body: { bookingRequestId }, user } = req;
      if (bookingRequestId) {
        const result = await bookingMessageRepository.getBookingRequestDetails(
          { id: bookingRequestId, userId: user.id },
        );
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
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify Boat Booking Amount
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async verifyBoatBookingAmount(req, res, next) {
    try {
      const { body: { boatId, duration }, boatInfo } = req;
      const result = await boatRepository.findOne(
        { id: boatId },
      );
      if (result) {
        const { renterFees } = await serviceFeesRepository.getServiceFees();
        const salesTaxResult = await salesTaxRepository.getSalesTax({ query: { zipCode: boatInfo?.zipCode } })
        const { amount } = result.boatPrices.find((element) => element.duration === duration);
        const totalAmount = utility.calculatePercentage(amount, renterFees) + utility.calculatePercentage(amount, salesTaxResult?.salesTax ?? 0) + Number(amount);
        if (Number(req?.body?.amount) === totalAmount) {
          next();
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'BOOKING_AMOUNT_INVALID'),
          });
        }
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify Event Booking Amount
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async verifyEventBookingAmount(req, res, next) {
    try {
      const { body: { eventId, adults, children } } = req;
      const result = await eventRepository.getEventDetails(
        { id: eventId },
      );
      if (result) {
        const salesTaxResponse = await salesTaxRepository.getSalesTax({ query: { zipCode: req.eventInfo?.boat?.zipCode } })
        const { renterFees } = await serviceFeesRepository.getServiceFees();
        const { adultPrice, childrenPrice } = result;
        const totalAdultPrice = Number(adults) * Number(adultPrice);
        const totalChildrenPrice = Number(children) * Number(childrenPrice);
        const totalAmount = totalAdultPrice + totalChildrenPrice;
        const totalAmountWithServiceFees = (
          (Number(totalAmount) / 100) * Number(renterFees)) + Number(totalAmount) + (Number(totalAmount) / 100) * Number(salesTaxResponse?.salesTax ?? 0);

          console.log(totalAmountWithServiceFees.toFixed(2), req.body.amount);
          
        if (Number(req?.body?.amount) === Number(totalAmountWithServiceFees.toFixed(2))) {
          next();
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'BOOKING_AMOUNT_INVALID'),
          });
        }
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'EVENT_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify booking date for cancelation
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async verifyBookingDateForCancelation(req, res, next) {
    try {
      const { params: { id } } = req;
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      const result = await bookingRepository.getBoatBookingDetail(
        { id, bookingDate: { [Op.gte]: utility.getCurrentDateTimeByTimezone('', timezone) } },
      );
      if (result) {
        if (result?.status === 'completed') {
          throw utility.customError(req, 'BOOKING_COMPLETED_CANCELLATION', 1);
        }
        if (result?.status === 'cancelled') {
          throw utility.customError(req, 'BOOKING_ALREADY_CANCELLED', 1);
        }
        req.bookingInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOOKING_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Boat Booking status cancelled
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBookingStatusCancelled(req, res, next) {
    try {
      const { params: { id } } = req;
      const result = await bookingRepository.getBoatBookingDetail(
        { id, status: bookingConstant.BOOKING_STATUS.CANCELED },
      );
      if (result) {
        req.boatBookingInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOOKING_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Boat Booking status completed
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBookingStatusCompleted(req, res, next) {
    try {
      const { params: { id } } = req;
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      const result = await bookingRepository.getBoatBookingDetail(
        {
          id,
          status: bookingConstant.BOOKING_STATUS.PENDING,
          bookingDate: { [Op.lt]: utility.getCurrentDateTimeByTimezone('', timezone) },
        },
      );
      if (result) {
        req.boatBookingInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOOKING_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Booking payment already refunded
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkAlreadyRefunded(req, res, next) {
    try {
      const { boatBookingInfo } = req;
      const result = await bookingRepository.checkAlreadyRefunded(boatBookingInfo);
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'ALREADY_REFUND'),
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Event Booking exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkEventBookingAndCancelledExists(req, res, next) {
    try {
      const { params: { id }, user } = req;
      const result = await bookingRepository.getEventBookingDetail({ id, userId: user.id });
      if (result) {
        if (result?.status === 'cancelled') {
          throw utility.customError(req, 'BOOKING_ALREADY_CANCELLED', 1);
        }
        req.eventBookingInfo = result;
        req.body.eventId = result?.eventId;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'EVENT_BOOKING_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Booking payment already transferred
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkAlreadyTransfer(req, res, next) {
    try {
      const { boatBookingInfo } = req;
      const result = await bookingRepository.checkAlreadyTransferred(boatBookingInfo);
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'ALREADY_TRANSFERRED'),
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Event Booking status cancelled
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkEventBookingStatusCancelled(req, res, next) {
    try {
      const { params: { id } } = req;
      const result = await bookingRepository.getEventBookingDetail(
        { id, status: bookingConstant.EVENT_BOOKING_STATUS.CANCELED },
      );
      if (result) {
        req.eventBookingInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'EVENT_BOOKING_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Event Booking payment already refunded
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkEventBookingAlreadyRefunded(req, res, next) {
    try {
      const { eventBookingInfo } = req;
      const result = await bookingRepository.checkEventBookingAlreadyRefunded(eventBookingInfo);
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'ALREADY_REFUND'),
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat booked slot
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBookingActiveAndValidDate(req, res, next) {
    try {
      const {
        body: {
          startTime,
        },
        boatInfo,
        user,
      } = req;
      const convertedBookingDate = utility.convertFormat(
        startTime,
        commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME,
      );
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      // eslint-disable-next-line max-len
      const today = utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone);
      const isInvalidDateTime = utility.dateIsAfter(today, convertedBookingDate);
      if (isInvalidDateTime) {
        throw utility.customError(req, 'BOOKING_DATE_TIME_INVALID', 1);
      }
      if (boatInfo.isBooking === 0) {
        throw utility.customError(req, 'BOOKING_INACTIVE_BY_ADMIN', 1);
      }
      if (boatInfo.ownerId === user?.id) {
        throw utility.customError(req, 'BOOKING_OWN_BOAT_BY_OWNER', 1);
      }
      next();
    } catch (error) {
      next(error);
    }
  },

  async verifyNumberOfAttendee(req, res, next) {
    try {
      const { body: { eventId, adults, children }, eventInfo } = req;
      const result = await eventBooking.findAll(
        {
          where: {
            eventId,
            paymentStatus: bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED,
            status: bookingConstant.EVENT_BOOKING_STATUS.PENDING,
          },
        },
      );
      if (result.length > 0) {
        const numberOfAttendees = Number(adults) + Number(children);
        let totalNumberOfAttendees = numberOfAttendees;
        for (let index = 0; index < result.length; index++) {
          totalNumberOfAttendees += (result[index].adults + result[index].children);
        }
        if (totalNumberOfAttendees <= eventInfo?.numberOfAttendee) {
          next();
        } else {
          throw utility.customError(req, 'EVENT_BOOKING_FULL', 1);
        }
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat status listed at booking time
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async verifyBoatListed(req, res, next) {
    try {
      const {
        body: { boatId },
      } = req;
      const result = await boatRepository.findOne({
        id: boatId,
        liveStatus: boatConstant.BOAT_LIVE_STATUS.LISTED,
      });
      if (result) {
        req.boatInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_NOT_LISTED'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

};
