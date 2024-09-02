import HttpStatus from 'http-status';
import { Op } from 'sequelize';
import repositories from '../repositories';
import utility from '../services/utility';
import models from '../models';
import constant from '../constant';

const { bookingConstant, commonConstant } = constant;
const { eventRepository, boatRepository } = repositories;
const { eventBooking } = models;

export default {
  /**
   * Check Event exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkEventExists(req, res, next) {
    try {
      const { body: { eventId }, params: { id } } = req;
      const finalEventId = eventId || id;
      const result = await eventRepository.getEventDetails({ id: finalEventId });
      if (result) {
        req.eventInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'EVENT_NOT_FOUND'),
        });
      }
    } catch (error) {
      console.log(error);
      
      next(error);
    }
  },

  /**
   * Check Event date exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkEventDateExists(req, res, next) {
    try {
      const { body: { eventId }, params: { id } } = req;
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      const finalEventId = eventId || id;
      const result = await eventRepository.getEventDetails(
        // eslint-disable-next-line max-len
        { id: finalEventId, eventDate: { [Op.gte]: utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone) } },
      );
      if (result) {
        req.eventInfo = result;
        next();
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
   * Check event boat exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkEventBoatExists(req, res, next) {
    try {
      const {
        body: { boatId },
      } = req;
      const result = await boatRepository.findOne({ id: boatId });
      if (result) {
        if (result.status !== 'completed' && result.liveStatus !== 'listed') {
          throw utility.customError(req, 'EVENT_BOOKING_BOAT_NOT_EXIST', 1);
        }
        req.boatInfo = result;
        next();
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
   * Verify Number Of Attendee when update Number Of Attendee
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async verifyNumberOfAttendee(req, res, next) {
    try {
      const { body: { numberOfAttendee }, params: { id } } = req;
      const result = await eventBooking.findAll(
        {
          where: {
            eventId: id,
            paymentStatus: bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED,
            status: bookingConstant.EVENT_BOOKING_STATUS.PENDING,
          },
        },
      );
      if (result.length > 0) {
        let totalNumberOfAttendees = 0;
        for (let index = 0; index < result.length; index++) {
          totalNumberOfAttendees += (result[index].adults + result[index].children);
        }
        if (totalNumberOfAttendees > numberOfAttendee) {
          throw utility.customError(req, 'EVENT_VERIFY_NUMBER_OF_ATTENDEE', 1);
        } else {
          next();
        }
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
      
      next(error);
    }
  },

    /**
   * Check boat Blocked or not
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
    async checkBoatBlocked(req, res, next) {
      try {
        const {
          body: { boatId, eventDate },
          params: { id },
        } = req;
        const finalBoatId = boatId || id;
        const result = await boatRepository.getBoatBlockedDateStatus(finalBoatId, utility.convertFormat(eventDate));
        if (!result) {
          next();
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'BOAT_BLOCKED'),
          });
        }
      } catch (error) {
        console.log(error);
        
        next(error);
      }
    }
};
