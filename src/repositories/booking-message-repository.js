/* eslint-disable max-len */
/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';
import utility from '../services/utility';
import constant from '../constant';
import notificationRepository from './notifications-repository';
import Email from '../services/email';

const {
  bookingConstant, commonConstant,
} = constant;

const {
  bookingRequest, bookingRequestMessage,
} = models;

export default {
  /**
   * Add Booking Request
   * @param {Object} req
   */
  async addBookingRequest(req) {
    try {
      const {
        body: {
          boatId, duration, bookingDate, startTime, endTime, message,
        },
        user,
        boatInfo,
      } = req;
      const timezone = req.headers.timezone
        ? req.headers.timezone
        : 'Asia/Calcutta';
      const data = {
        userId: user.id,
        ownerId: boatInfo.ownerId,
        boatId,
        bookingDate: utility.convertFormat(bookingDate),
        startTime,
        endTime,
        timezone,
        duration,
        status: 'pending',
        message,
      };
      const bookingRequestData = await bookingRequest.create(data);
      req.params.id = bookingRequestData?.id;
      // boatInfo.bookingRequestDate = `${startTime} to ${endTime}`;
      boatInfo.bookingRequestDate = startTime;
      boatInfo.renterName = `${user.firstName} ${user.lastName ?? ''}`;
      this.addBookingRequestMessage(req);
      const notificationData = {
        toUserId: data?.ownerId,
        fromUserId: user.id,
        notificationsType: 'boat_booking_request',
        message: await utility.getNotificationMessage(req, { type: 'BOAT_BOOKING_REQUEST' }, boatInfo),
        customFields: bookingRequestData ? JSON.stringify(bookingRequestData) : null,
      };
      const messageData = await utility.getEmailMessage(req, { type: 'BOAT_BOOKING_REQUEST' }, boatInfo)
      await notificationRepository.addUserNotification(notificationData);
      Email.bookingRequest({ ...boatInfo.owner.dataValues, message: messageData, });
      return bookingRequestData;
    } catch (error) {
      logMessage.bookingMessageErrorMessage('bookingRequestAdd', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Add Booking Request Message
   * @param {Object} req
   */
  async addBookingRequestMessage(req) {
    try {
      const { body: { message }, params: { id }, user, boatInfo } = req;
      const Data = {
        fromUserId: user.id,
        bookingRequestId: id,
        message,
      };
      let emailData = null
      const getEmailDetails = async (recipient, messageType, subject) => {
        const emailMessage = await utility.getEmailMessage(req, { type: messageType }, user);
        return {
          ...recipient,
          message: emailMessage,
          subject: subject
        };
      };
      if (!req.bookingRequestInfo) {
        emailData = await getEmailDetails(boatInfo.owner.dataValues, 'RECEIVED_MESSAGE_FOR_OWNER', "New Message Alert for Your Boat Listing");
      } else {
        const owner = req.bookingRequestInfo.owner.dataValues;
        const renter = req.bookingRequestInfo.user.dataValues;

        if (owner.id === user.id) {
          emailData = await getEmailDetails(renter, 'RECEIVED_MESSAGE_FOR_RENTER', "New Message Alert");
        } else if (renter.id === user.id) {
          emailData = await getEmailDetails(owner, 'RECEIVED_MESSAGE_FOR_OWNER', "New Message Alert for Your Boat Listing");
        }
      }
      if (emailData.email) {
        Email.receivedMessages(emailData);
      }
      return await bookingRequestMessage.create(Data);
    } catch (error) {
      logMessage.bookingMessageErrorMessage('bookingRequestMessageAdd', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Get Booking Request List
   * @param {object} req
   * @returns
   */
  async getBookingRequest(req) {
    try {
      const {
        query: {
          limit, offset, scope, type, search,
        },
        user,
      } = req;
      const where = {};
      if (type && type === 'renter') {
        where.userId = user.id;
      }
      if (type && type === 'owner') {
        where.ownerId = user.id;
      }
      if (search) {
        where['$boat.name$'] = { [Op.like]: `%${search}%` };
      }
      let searchCriteria = {
        where,
        order: [['id', 'DESC']],
      };
      if (scope !== 'all') {
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      const boatDetail = [{ method: ['boatDetails'] }];
      return await bookingRequest.scope(boatDetail).findAndCountAll(searchCriteria);
    } catch (error) {
      logMessage.bookingMessageErrorMessage('bookingRequestList', { error });
      throw Error(error);
    }
  },

  /**
   * Get Booking Request Details
   * @param {Object} where
   */
  async getBookingRequestDetails(where) {
    try {
      const boatDetail = [{ method: ['boatDetails'] }];
      const searchCriteria = {
        where,
      };
      return await bookingRequest.scope(boatDetail).findOne(searchCriteria);
    } catch (error) {
      logMessage.bookingMessageErrorMessage('bookingRequestDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Get Booking Request message List
   * @param {object} req
   * @returns
   */
  async getBookingRequestMessage(req) {
    try {
      const {
        query: {
          limit, offset, scope,
        },
        params: { id },
      } = req;
      let searchCriteria = {
        where: { bookingRequestId: id },
        order: [['id', 'DESC']],
      };
      if (scope !== 'all') {
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      const userDetails = [{ method: ['userDetails'] }];
      return await bookingRequestMessage.scope(userDetails).findAndCountAll(searchCriteria);
    } catch (error) {
      logMessage.bookingMessageErrorMessage('bookingRequestMessageList', { error });
      throw Error(error);
    }
  },

  /**
   *Update booking request status
   * @param {Object} req
   */
  async updateBookingRequestStatus(req) {
    try {
      const { id } = req.params;
      const { bookingRequestInfo: { user } } = req;
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      const data = {
        status: bookingConstant.BOAT_BOOKING_REQUEST_STATUS.APPROVED,
        approvedAt: utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone),
      };
      const message = await utility.getEmailMessage(req, { type: 'PRE_BOOKING_APPROVAL_FOR_RENTER' }, user)
      Email.preApprovalBooking({ ...user.dataValues, message })
      return await bookingRequest.update(data, { where: { id } });
    } catch (error) {
      logMessage.bookingMessageErrorMessage('bookingRequestUpdate', { error, data: req?.body });
      throw Error(error);
    }
  },

};
