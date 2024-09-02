/* eslint-disable max-len */
/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';
import utility from '../services/utility';
import stripeService from '../services/stripe-service';
import constant from '../constant';
import notificationRepository from './notifications-repository';
import Email from '../services/email';
import salesTaxRepository from './sales-tax-repository';

const {
  bookingConstant, commonConstant,
} = constant;

const {
  booking, bookingPayment, eventBooking, eventBookingPayment, event, serviceFees, userBankAccount,
  bookingRequest, boat, bookingLog,
} = models;

export default {
  /**
   * Add Boat booking
   * @param {Object} req
   */
  async addBooking(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const {
        body: {
          boatId, duration, bookingDate, startTime, endTime, amount, currency,
          identityNumber, firstName, lastName, email, mobileNumber, description,
          dateOfBirth, countryId, bookingRequestId,
        },
        user,
        boatInfo,
      } = req;
      let timeDuration = duration;
      // if (user.userRole?.role?.dataValues?.role === commonConstant.ROLE.ADMIN) {
      //   timeDuration = 24;
      // }
      const { renterFees, ownerFees } = await serviceFees.findOne({});
      const res = await salesTaxRepository.getSalesTax({ query: { zipCode: boatInfo?.zipCode } })
      const timezone = req.headers.timezone
        ? req.headers.timezone
        : commonConstant.TIMEZONE.INDIA;
      const { ownerId, cancellationPolicy, boatPrices } = boatInfo;
      const boatPrice = (boatPrices.find(
        (element) => element?.duration === timeDuration,
      )).amount;

      const data = {
        userId: user.id,
        ownerId,
        boatId,
        code: utility.generateRandomString(10),
        bookingDate: utility.convertFormat(bookingDate),
        startTime,
        endTime,
        timezone,
        duration: timeDuration,
        amount,
        currency: currency.toLowerCase(),
        status: bookingConstant.BOOKING_STATUS.PENDING,
        paymentStatus: bookingConstant.BOAT_BOOKING_PAYMENT_STATUS.PENDING,
        identityNumber,
        firstName,
        lastName,
        email,
        mobileNumber,
        description,
        dateOfBirth: utility.convertFormat(dateOfBirth),
        countryId,
        bookingRequestId,
        cancellationPolicy,
        boatPrice,
        renterServiceFees: renterFees,
        ownerServiceFees: ownerFees,
        salesTax: Number(((Number(boatPrice) / 100) * Number(res?.salesTax ?? 0)).toFixed(2)) ?? 0
      };
      const boatBooking = await booking.create(data, { transaction });
      const paymentIntent = await this.createPayment(user, boatBooking, transaction);
      if (paymentIntent?.client_secret) {
        const paymentData = {
          bookingId: boatBooking.id,
          userId: user.id,
          ownerId,
          boatId,
          amount,
          currency: currency.toLowerCase(),
          transactionId: paymentIntent?.id,
          paymentResponse: JSON.stringify(paymentIntent),
          status: paymentIntent?.status,
        };
        await bookingPayment.create(paymentData, { transaction });
      }
      await transaction.commit();
      const result = {
        boatBooking,
        paymentIntent,
      };
      return result;
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      logMessage.bookingErrorMessage('bookingAdd', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Booking list
   * @param {object} req
   * @returns
   */
  async bookingList(req) {
    try {
      const {
        query: {
          limit, offset, status, scope, bookingDate, boatId, search, sortBy, sortType,
        },
      } = req;
      const sortFields = [
        'bookingDate',
        'code',
        'status',
        'boatName',
        'subTotal',
        'refund',
        'payout',
      ];
      let orderBy = [['id', 'DESC']];
      const where = {};
      if (status) {
        where.status = status;
      }
      if (boatId) {
        where.boatId = boatId;
      }
      if (bookingDate) {
        const dateFilter = utility.convertFormat(bookingDate);
        where.bookingDate = { [Op.and]: [{ [Op.eq]: dateFilter }] };
      }
      if (search) {
        where[Op.or] = [{ '$data.boatName$': { [Op.like]: `%${search}%` } }, { code: { [Op.like]: `%${search}%` } }];
      }
      if (
        sortBy
        && sortType
        && sortFields.includes(sortBy)
      ) {
        switch (sortBy) {
          case 'boatName':
            orderBy = [[{ model: boat }, 'name', sortType]];
            break;
          case 'subTotal':
            orderBy = [['amount', sortType]];
            break;
          case 'refund':
            orderBy = [[{ model: bookingPayment }, 'refundStatus', sortType]];
            break;
          case 'payout':
            orderBy = [[{ model: bookingPayment }, 'transferStatus', sortType]];
            break;
          default:
            orderBy = [[sortBy, sortType]];
            break;
        }
      }
      let searchCriteria = {
        where,
        order: orderBy,
      };
      if (scope !== 'all') {
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      const bookingList = [{ method: ['bookingList'] }];
      const result = await booking.scope(bookingList).findAndCountAll(searchCriteria);
      return result;
    } catch (error) {
      logMessage.boatErrorMessage('boatList', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Create stripe customer and payment intent
   * @param {Object} user
   * @returns
   */
  async createPayment(userData, bookingDetail, transaction) {
    try {
      let customerId = '';
      if (userData?.stripeCustomerId) {
        customerId = userData?.stripeCustomerId;
      } else {
        const customerData = {
          name: userData?.firstName,
          email: userData?.email,
          description: `Customer - ${userData?.firstName}`,
          address: {
            city: userData?.userAddress?.city,
            country: commonConstant.COUNTRY.US,
            line1: userData?.userAddress?.street,
          },
        };

        const customer = await stripeService.createCustomer(customerData);
        customerId = customer?.id;
        await userData.update({ stripeCustomerId: customerId }, { transaction });
      }

      const currency = commonConstant.CURRENCY.USD;
      // create payment intent
      const intentData = {
        customer: customerId,
        amount: Math.round(parseFloat(bookingDetail?.amount) * 100),
        currency,
        capture_method: 'automatic', // automatic,manual
        description: `Booking id ${bookingDetail?.id} Booked by ${userData.firstName}`,
      };
      const paymentIntent = await stripeService.createPaymentIntent(
        intentData,
      );
      return paymentIntent;
    } catch (error) {
      logMessage.bookingErrorMessage('bookingCreatePayment', { error, data: bookingDetail });
      throw (error.errorCode) ? error : Error(error);
    }
  },

  /**
   * Boat booking payment detail update
   * @param {Object} req
   */
  async bookingCheckout(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const {
        body: {
          boatId, token,
        },
        params: { id },
        user,
      } = req;
      const bookingId = id;
      const searchCriteria = {
        id,
        boatId,
        paymentStatus: bookingConstant.BOAT_BOOKING_PAYMENT_STATUS.PENDING,
      };
      const boatBooking = await this.getBoatBookingDetail(searchCriteria);

      if (!boatBooking) {
        throw utility.customError(req, 'BOOKING_NOT_EXIST', 1);
      }
      const paymentRetrieve = await stripeService.RetrievePayment({ payment_intent: token });
      if (paymentRetrieve?.status === bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED) {
        await boatBooking.update({ paymentStatus: paymentRetrieve?.status }, { transaction });
        const where = {
          bookingId,
          boatId,
          userId: user.id,
        };
        const paymentInfo = await bookingPayment.findOne({ where });
        const paymentData = {
          paymentResponse: JSON.stringify(paymentRetrieve),
          status: paymentRetrieve?.status,
        };
        if (boatBooking.bookingRequestId) {
          const bookingRequestData = {
            status: bookingConstant.BOAT_BOOKING_REQUEST_STATUS.COMPLETED,
          };
          await bookingRequest.update(
            bookingRequestData,
            { where: { id: boatBooking.bookingRequestId } },
            { transaction },
          );
        }
        await paymentInfo.update(paymentData, { transaction });
      } else {
        throw utility.customError(req, 'BOOKING_NOT_COMPLETED', 1);
      }
      await transaction.commit();
      const notificationData = {
        toUserId: boatBooking.ownerId,
        fromUserId: user.id,
        notificationsType: 'boat_booking',
        message: await utility.getNotificationMessage(req, { type: 'BOAT_BOOKING' }, boatBooking),
        customFields: boatBooking ? JSON.stringify(boatBooking) : null,
      };
      await notificationRepository.addUserNotification(notificationData);
      // sending email to owner for Boat Booking confirmation
      const message = await utility.getEmailMessage(req, { type: 'BOAT_BOOKING_CONFIRMATION_FOR_OWNER' }, boatBooking)
      await Email.boatBookingConfirmation({ ...boatBooking.owner.dataValues, message })
      return boatBooking;
    } catch (error) {
      await transaction.rollback();
      logMessage.bookingErrorMessage('paymentRetrieve', { error, data: req?.body });
      throw (error.errorCode) ? error : Error(error);
    }
  },

  /**
   * Add Event booking
   * @param {Object} req
   */
  async addEventBooking(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const {
        body: {
          eventId, adults, children, amount, currency,
          identityNumber, firstName, lastName, email, mobileNumber,
          dateOfBirth, countryId,
        },
        user,
        eventInfo,
      } = req;
      const { renterFees } = await serviceFees.findOne({});
      const { salesTax } = await salesTaxRepository.getSalesTax({ query: { zipCode: eventInfo?.boat?.zipCode } });
      const { adultPrice, childrenPrice } = eventInfo;
      const totalAdultPrice = Number(adults) * Number(adultPrice);
      const totalChildrenPrice = Number(children) * Number(childrenPrice);
      const totalAmount = totalAdultPrice + totalChildrenPrice;
      const data = {
        userId: user.id,
        eventId,
        adults,
        children,
        code: utility.generateRandomString(10),
        amount,
        currency: currency.toLowerCase(),
        status: bookingConstant.EVENT_BOOKING_STATUS.PENDING,
        paymentStatus: bookingConstant.EVENT_BOOKING_PAYMENT_STATUS.PENDING,
        identityNumber,
        firstName,
        lastName,
        email,
        mobileNumber,
        dateOfBirth: utility.convertFormat(dateOfBirth),
        countryId,
        perAdultPrice: adultPrice,
        perChildPrice: childrenPrice,
        serviceFees: renterFees,
        salesTax: (Number(totalAmount) / 100) * Number(salesTax ?? 0) ?? 0,
      };

      const bookingData = await eventBooking.create(data, { transaction });
      const paymentIntent = await this.createPayment(user, bookingData, transaction);
      if (paymentIntent?.client_secret) {
        const paymentData = {
          bookingId: bookingData.id,
          userId: user.id,
          eventId,
          amount,
          currency: currency.toLowerCase(),
          transactionId: paymentIntent?.id,
          paymentResponse: JSON.stringify(paymentIntent),
          status: paymentIntent?.status,
        };
        await eventBookingPayment.create(paymentData, { transaction });
      }
      await transaction.commit();
      const result = {
        bookingData,
        paymentIntent,
      };
      return result;
    } catch (error) {
      await transaction.rollback();
      logMessage.bookingErrorMessage('bookingAdd', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Event booking payment detail update
   * @param {Object} req
   */
  async eventBookingCheckout(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const {
        body: {
          eventId, token,
        },
        params: { id },
        user,
      } = req;
      const bookingId = id;
      const searchCriteria = {
        id: bookingId,
        eventId,
        paymentStatus: bookingConstant.EVENT_BOOKING_PAYMENT_STATUS.PENDING,
      };
      const eventBookingData = await this.getEventBookingDetail(searchCriteria);
      if (!eventBookingData) {
        throw utility.customError(req, 'EVENT_BOOKING_NOT_EXIST', 1);
      }

      const paymentRetrieve = await stripeService.RetrievePayment({ payment_intent: token });
      if (paymentRetrieve?.status === bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED) {
        await eventBookingData.update({ paymentStatus: paymentRetrieve?.status }, { transaction });
        const where = {
          bookingId,
          eventId,
          userId: user.id,
        };
        const paymentInfo = await eventBookingPayment.findOne({ where });
        const paymentData = {
          paymentResponse: JSON.stringify(paymentRetrieve),
          status: paymentRetrieve?.status,
        };
        await paymentInfo.update(paymentData, { transaction });

        const eventWhere = {
          id: eventId,
        };
        const eventInfo = await event.findOne({ where: eventWhere });
        const bookedSeat = parseInt(eventInfo?.bookedSeat)
          + parseInt(eventBookingData?.adults)
          + parseInt(eventBookingData?.children);
        const eventData = {
          bookedSeat,
        };
        await eventInfo.update(eventData, { transaction });
      } else {
        throw utility.customError(req, 'EVENT_BOOKING_NOT_COMPLETED', 1);
      }
      await transaction.commit();
      const notificationData = {
        toUserId: 1,
        fromUserId: user.id,
        notificationsType: 'event_booking',
        message: await utility.getNotificationMessage(req, { type: 'EVENT_BOOKING' }, eventBookingData),
        customFields: eventBookingData ? JSON.stringify(eventBookingData) : null,
      };
      await notificationRepository.addUserNotification(notificationData);
      const message = await utility.getEmailMessage(req, { type: 'TICKET_BOUGHT_FOR_RENTER' }, eventBookingData)
      Email.ticketsBoughtForEvent({ ...user.dataValues, id: eventBookingData.code, message })
      return eventBookingData;
    } catch (error) {
      await transaction.rollback();
      logMessage.bookingErrorMessage('paymentRetrieve', { error, data: req?.body });
      throw (error.errorCode) ? error : Error(error);
    }
  },

  /**
   * Get list of user's event
   * @param {Object} req
   */
  async getEventBookings(req) {
    try {
      const {
        query: {
          sortBy, sortType, limit, offset, scope, type, search,
        }, user,
      } = req;
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      const where = { paymentStatus: bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED };
      if (user.userRole?.role?.dataValues?.role !== commonConstant.ROLE.ADMIN) {
        where.userId = user.id;
      }
      const sortFields = [
        'event',
        'userName',
        'date',
        'status',
        'numberOfAttendees',
      ];
      let orderBy = [['createdAt', 'DESC']];
      if (sortBy && sortType && sortFields.includes(sortBy)) {
        switch (sortBy) {
          case 'event':
            orderBy = [[{ model: event }, 'name', sortType]];
            break;
          case 'userName':
            orderBy = [['firstName', sortType]];
            break;
          case 'date':
            orderBy = [[{ model: event }, 'eventDate', sortType]];
            break;
          case 'numberOfAttendees':
            orderBy = [[{ model: event }, 'bookedSeat', sortType]];
            break;
          default:
            orderBy = [[sortBy, sortType]];
            break;
        }
      }
      if (type) {
        if (type.toLowerCase() === bookingConstant.GET_BOOKING_TYPE.UPCOMING) {
          where['$event.event_date$'] = { [Op.gte]: utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone) };
        }
        if (type.toLowerCase() === bookingConstant.GET_BOOKING_TYPE.PREVIOUS) {
          where['$event.event_date$'] = { [Op.lt]: utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone) };
        }
      }
      if (search) {
        where['$event.name$'] = { [Op.like]: `%${search}%` };
      }
      let searchCriteria = {
        where,
        order: orderBy,
      };
      if (scope !== 'all') {
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      const eventBookingList = [{ method: ['eventBookingList'] }];
      return await eventBooking.scope(eventBookingList).findAndCountAll(searchCriteria);
    } catch (error) {
      logMessage.bookingErrorMessage('eventBookingList', { error });
      throw Error(error);
    }
  },

  /**
   * Get list of user's boat booking - (user as renter )
   * @param {Object} req
   */
  async getBoatBookings(req) {
    try {
      const {
        query: {
          sortBy, sortType, limit, offset, scope, type,
        }, user,
      } = req;
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      const where = {
        userId: user.id,
        paymentStatus: bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED,
      };
      let orderBy = [['createdAt', 'DESC']];
      if (sortBy && sortType) {
        orderBy = [[sortBy, sortType]];
      }
      if (type) {
        if (type.toLowerCase() === bookingConstant.GET_BOOKING_TYPE.UPCOMING) {
          where.startTime = {
            [Op.gte]: utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone),
          };
        }
        if (type.toLowerCase() === bookingConstant.GET_BOOKING_TYPE.PREVIOUS) {
          where.startTime = {
            [Op.lt]: utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone),
          };
        }
      }
      let searchCriteria = {
        where,
        order: orderBy,
      };
      if (scope !== 'all') {
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      const bookingList = [{ method: ['bookingList'] }];
      const data = await booking.scope(bookingList).findAndCountAll(searchCriteria);
      return data
    } catch (error) {
      logMessage.bookingErrorMessage('bookingList', { error });
      throw Error(error);
    }
  },

  /**
   * Get list of user's boat Reservation - (user as owner)
   * @param {Object} req
   */
  async getBoatReservations(req) {
    try {
      const {
        query: {
          sortBy, sortType, limit, offset, scope, type,
        }, user,
      } = req;
      const where = {
        ownerId: user.id,
        paymentStatus: bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED,
      };
      let orderBy = [['createdAt', 'DESC']];
      if (sortBy && sortType) {
        orderBy = [[sortBy, sortType]];
      }
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      if (type) {
        if (type.toLowerCase() === bookingConstant.GET_BOOKING_TYPE.UPCOMING) {
          where.startTime = {
            [Op.gte]: utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone),
          };
        }
        if (type.toLowerCase() === bookingConstant.GET_BOOKING_TYPE.PREVIOUS) {
          where.startTime = {
            [Op.lt]: utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone),
          };
        }
      }
      let searchCriteria = {
        where,
        order: orderBy,
      };
      if (scope !== 'all') {
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      const reservationsList = [{ method: ['reservationsList'] }];
      return await booking.scope(reservationsList).findAndCountAll(searchCriteria);
    } catch (error) {
      logMessage.bookingErrorMessage('reservationsList', { error });
      throw Error(error);
    }
  },

  /**
   * Find Boat booking for itinerary and receipt
   * @param {Object} where
   */
  async getBoatBookingDetail(where) {
    try {
      const bookingDetail = [{ method: ['bookingDetail'] }];
      const searchCriteria = {
        where,
      };
      return await booking.scope(bookingDetail).findOne(searchCriteria);
    } catch (error) {
      logMessage.bookingErrorMessage('boatBookingDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Find Event booking for itinerary and receipt
   * @param {Object} where
   */
  async getEventBookingDetail(where) {
    try {
      const eventBookingDetail = [{ method: ['eventBookingDetail'] }];
      const searchCriteria = {
        where,
      };
      return await eventBooking.scope(eventBookingDetail).findOne(searchCriteria);
    } catch (error) {
      logMessage.bookingErrorMessage('eventBookingDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Booking cancellation
   * @param {Object} req
   */
  async bookingCancellation(req) {
    try {
      const {
        body: { reason }, params: { id }, user, boatBookingInfo,
      } = req;
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      const data = {
        reason,
        canceledBy: user?.id,
        canceledAt: utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone),
        status: bookingConstant.BOOKING_STATUS.CANCELED,
      };
      const bookingData = await booking.update(data, { where: { id } });
      const notificationData = [];

      if (boatBookingInfo.ownerId === user.id) {
        notificationData.push({
          toUserId: 1,
          fromUserId: user.id,
          notificationsType: 'boat_booking_cancellation',
          message: await utility.getNotificationMessage(req, { type: 'BOAT_BOOKING_CANCELLATION_FOR_ADMIN' }, boatBookingInfo),
          customFields: boatBookingInfo ? JSON.stringify(boatBookingInfo) : null,
        });
        notificationData.push({
          toUserId: boatBookingInfo?.userId,
          fromUserId: user.id,
          notificationsType: 'boat_booking_cancellation',
          message: await utility.getNotificationMessage(req, { type: 'BOAT_BOOKING_CANCELLATION_FOR_RENTER', reason }, boatBookingInfo),
          customFields: boatBookingInfo ? JSON.stringify(boatBookingInfo) : null,
        });
        const message = await utility.getEmailMessage(req, { type: 'BOAT_BOOKING_CANCELLATION_FOR_RENTER', reason }, boatBookingInfo)
        await Email.boatBookingCancellation({ ...boatBookingInfo.user.dataValues, message })
      } else {
        notificationData.push(
          {
            toUserId: boatBookingInfo.ownerId,
            fromUserId: user.id,
            notificationsType: 'boat_booking_cancellation',
            message: await utility.getNotificationMessage(req, { type: 'BOAT_BOOKING_CANCELLATION_FOR_OWNER' }, boatBookingInfo),
            customFields: boatBookingInfo ? JSON.stringify(boatBookingInfo) : null,
          },
          {
            toUserId: 1,
            fromUserId: user.id,
            notificationsType: 'boat_booking_cancellation',
            message: await utility.getNotificationMessage(req, { type: 'BOAT_BOOKING_CANCELLATION_FOR_ADMIN' }, boatBookingInfo),
            customFields: boatBookingInfo ? JSON.stringify(boatBookingInfo) : null,
          },
        );
        const message = await utility.getEmailMessage(req, { type: 'BOAT_BOOKING_CANCELLATION_FOR_OWNER' }, boatBookingInfo)
        await Email.boatBookingCancellation({ ...boatBookingInfo.owner.dataValues, message })
      }
      await notificationRepository.addNotifications(notificationData);
      return bookingData;
    } catch (error) {
      logMessage.bookingErrorMessage('bookingCancellation', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Event Booking cancellation
   * @param {Object} req
   */
  async eventBookingCancellation(req) {
    try {
      const {
        body: { reason }, params: { id }, user, eventBookingInfo,
      } = req;
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      const data = {
        reason,
        canceledBy: user?.id,
        canceledAt: utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone),
        status: bookingConstant.EVENT_BOOKING_STATUS.CANCELED,
      };
      const eventBookingData = await eventBooking.update(data, { where: { id } });
      const notificationData = {
        toUserId: 1,
        fromUserId: user.id,
        notificationsType: 'event_booking_cancellation',
        message: await utility.getNotificationMessage(req, { type: 'EVENT_BOOKING_CANCELLATION' }, eventBookingInfo),
        customFields: eventBookingInfo ? JSON.stringify(eventBookingInfo) : null,
      };
      await notificationRepository.addUserNotification(notificationData);
      const message = await utility.getEmailMessage(req, { type: 'EVENT_BOOKING_CANCELLATION' }, eventBookingInfo)
      Email.ticketsBoughtForEventCancellation({ ...user.dataValues, id: eventBookingInfo.code, message })
      return eventBookingData;
    } catch (error) {
      logMessage.bookingErrorMessage('eventBookingCancellation', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Booking cancellation payment refund
   * @param {Object} req
   */
  async bookingPaymentRefund(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const { boatBookingInfo } = req;

      // Calculate refund amount
      const cancellationPolicy = boatBookingInfo?.cancellationPolicy;
      const refundAmount = await this.calculateRefundAmount(boatBookingInfo, cancellationPolicy, 'boat');
      if (refundAmount > 0) {
        const where = {
          bookingId: boatBookingInfo?.id,
          boatId: boatBookingInfo?.boatId,
        };
        const paymentDetail = await bookingPayment.findOne({ where });
        if (paymentDetail
          && paymentDetail?.status === bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED) {
          const paymentInfo = {
            paymentIntentId: paymentDetail.transactionId,
            refundAmount,
          };
          const paymentRefund = await stripeService.refundAmount(paymentInfo);

          // update refund status amount in database
          const paymentData = {
            refundResponse: JSON.stringify(paymentRefund),
            refundStatus: paymentRefund?.status,
            refundAmount,
          };
          await paymentDetail.update(paymentData, { transaction });
          await transaction.commit();
          if (paymentRefund?.status !== bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED) {
            throw utility.customError(req, 'REFUND_NOT_COMPLETED', 1);
          }
          const notificationData = {
            toUserId: boatBookingInfo?.userId,
            fromUserId: 1,
            notificationsType: 'boat_booking_refund',
            message: await utility.getNotificationMessage(req, { type: 'BOAT_BOOKING_REFUND' }, boatBookingInfo),
            customFields: boatBookingInfo ? JSON.stringify(boatBookingInfo) : null,
          };
          await notificationRepository.addUserNotification(notificationData);
          return boatBookingInfo;
        }
        throw utility.customError(req, 'INVALID_PAYMENT_DETAIL', 1);
      } else {
        throw utility.customError(req, 'AMOUNT_NOT_REFUND', 1);
      }
    } catch (error) {
      await transaction.rollback();
      logMessage.bookingErrorMessage('bookingRefund', { error });
      throw (error.errorCode) ? error : Error(error);
    }
  },

  /**
   * Calculate refund amount
   * @param {Object} bookingInfo
   * @param {String} policy
   */
  async calculateRefundAmount(bookingInfo, policy, type) {
    try {
      const { amount } = bookingInfo;
      let daysUntilTrip;
      if (type === 'event') {
        daysUntilTrip = utility.dateSubtract(
          bookingInfo?.event?.eventDate,
          bookingInfo?.canceledAt,
        );
      } else {
        daysUntilTrip = utility.dateSubtract(bookingInfo.startTime, bookingInfo?.canceledAt);
      }
      let refundFee = 0;
      switch (policy) {
        case 'flexible':
          if (daysUntilTrip >= 1) {
            refundFee = amount;
          }
          break;
        case 'moderate':
          if (daysUntilTrip >= 5) {
            refundFee = amount;
          } else if (daysUntilTrip >= 1) {
            refundFee = amount * (50 / 100);
          }
          break;
        case 'strict':
          if (daysUntilTrip >= 7) {
            refundFee = amount * (50 / 100);
          }
          break;
        default:
          break;
      }
      return refundFee;
    } catch (error) {
      logMessage.bookingErrorMessage('calculateRefund', { error });
      throw Error(error);
    }
  },

  /**
   * Check Booking payment already refunded
   * @param {Object} where
   */
  async checkAlreadyRefunded(boatBookingInfo) {
    try {
      const { id, boatId } = boatBookingInfo;
      const where = {
        bookingId: id,
        boatId,
        refundStatus: bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED,
      };
      return await bookingPayment.findOne({ where });
    } catch (error) {
      logMessage.bookingErrorMessage('bookingRefund', { error });
      throw Error(error);
    }
  },

  /**
   * Check Booking payment already transferred
   * @param {Object} where
   */
  async checkAlreadyTransferred(boatBookingInfo) {
    try {
      const { id, boatId } = boatBookingInfo;
      const where = {
        bookingId: id,
        boatId,
        transferStatus: bookingConstant.STRIPE_PAYMENT_STATUS.TRANSFERRED,
      };
      return await bookingPayment.findOne({ where });
    } catch (error) {
      logMessage.bookingErrorMessage('bookingRefund', { error });
      throw Error(error);
    }
  },

  /**
   * Booking Amount transfer to owner account
   * @param {Object} req
   */
  async bookingAmountTransfer(req) {
    try {
      const { boatBookingInfo } = req;
      const transferAmount = await this.calculateTransferAmount(boatBookingInfo);
      if (transferAmount > 0) {
        const where = {
          bookingId: boatBookingInfo?.id,
          boatId: boatBookingInfo?.boatId,
        };
        const paymentDetail = await bookingPayment.findOne({ where });
        if (paymentDetail
          && paymentDetail?.status === bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED) {
          const accountWhere = {
            userId: boatBookingInfo.ownerId,
          };
          const bankAccountDetail = await userBankAccount.findOne({ where: accountWhere });
          if (!bankAccountDetail) {
            throw utility.customError(req, 'INVALID_BANK_ACCOUNT', 1);
          }

          const payload = {
            amount: Math.round(transferAmount * 100),
            currency: 'usd',
            destination: bankAccountDetail.stripeAccountId,
            transfer_group: `booking_${boatBookingInfo.id}`,
          };
          const stripeRes = await stripeService.createTransfers(payload);
          if (stripeRes && stripeRes.id) {
            // update transfer status amount in database
            const paymentData = {
              transferId: stripeRes.id,
              transferTransactionId: stripeRes.balance_transaction,
              destinationId: stripeRes.destination,
              transferredAmount: (stripeRes.amount / 100),
              transferStatus: bookingConstant.STRIPE_PAYMENT_STATUS.TRANSFERRED,
              transferResponse: JSON.stringify(stripeRes),
            };
            await paymentDetail.update(paymentData);

            // sending email for payout transfer
            const message = await utility.getEmailMessage(req, { type: 'PAYOUT_FOR_OWNER' }, boatBookingInfo)
            await Email.boatBookingPayoutTransfer({ ...boatBookingInfo.owner.dataValues, message })
            return boatBookingInfo;
          }
          throw utility.customError(req, 'AMOUNT_NOT_TRANSFER', 1);
        }
        throw utility.customError(req, 'INVALID_PAYMENT_DETAIL', 1);
      } else {
        throw utility.customError(req, 'AMOUNT_NOT_TRANSFER', 1);
      }
    } catch (error) {
      logMessage.bookingErrorMessage('bookingTransfer', { error });
      throw (error.errorCode) ? error : Error(error);
    }
  },

  /**
   * Calculate transfer amount
   * @param {Object} bookingInfo
   * @param {String} serviceFee
   */
  async calculateTransferAmount(bookingInfo) {
    try {
      const { boatPrice, ownerServiceFees } = bookingInfo;
      let transferFee = 0;
      if (boatPrice) {
        transferFee = (boatPrice - (boatPrice * (ownerServiceFees / 100)));
      }
      return transferFee;
    } catch (error) {
      logMessage.bookingErrorMessage('calculateTransferAmount', { error });
      throw Error(error);
    }
  },

  /**
   * Event Booking cancellation payment refund
   * @param {Object} req
   */
  async bookedEventPaymentRefund(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const { eventBookingInfo } = req;

      // Calculate refund amount
      const cancellationPolicy = eventBookingInfo?.event?.cancellationPolicy;
      const refundAmount = await this.calculateRefundAmount(eventBookingInfo, cancellationPolicy, 'event');
      if (refundAmount > 0) {
        const where = {
          bookingId: eventBookingInfo?.id,
          eventId: eventBookingInfo?.eventId,
        };
        const paymentDetail = await eventBookingPayment.findOne({ where });
        if (paymentDetail
          && paymentDetail?.status === bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED) {
          const paymentInfo = {
            paymentIntentId: paymentDetail.transactionId,
            refundAmount,
          };
          const paymentRefund = await stripeService.refundAmount(paymentInfo);

          // update refund status amount in database
          const paymentData = {
            refundResponse: JSON.stringify(paymentRefund),
            refundStatus: paymentRefund?.status,
            refundAmount,
          };
          await paymentDetail.update(paymentData, { transaction });
          await transaction.commit();
          if (paymentRefund?.status !== bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED) {
            throw utility.customError(req, 'REFUND_NOT_COMPLETED', 1);
          }
          const notificationData = {
            toUserId: eventBookingInfo?.userId,
            fromUserId: 1,
            notificationsType: 'event_booking_refund',
            message: await utility.getNotificationMessage(req, { type: 'EVENT_BOOKING_REFUND' }, eventBookingInfo),
            customFields: eventBookingInfo ? JSON.stringify(eventBookingInfo) : null,
          };
          await notificationRepository.addUserNotification(notificationData);
          return eventBookingInfo;
        }
        throw utility.customError(req, 'INVALID_PAYMENT_DETAIL', 1);
      } else {
        throw utility.customError(req, 'AMOUNT_NOT_REFUND', 1);
      }
    } catch (error) {
      await transaction.rollback();
      logMessage.bookingErrorMessage('eventBookingRefund', { error });
      throw (error.errorCode) ? error : Error(error);
    }
  },

  /**
   * Check Event Booking payment already refunded
   * @param {Object} where
   */
  async checkEventBookingAlreadyRefunded(eventBookingInfo) {
    try {
      const { id, eventId } = eventBookingInfo;
      const where = {
        bookingId: id,
        eventId,
        refundStatus: bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED,
      };
      return await eventBookingPayment.findOne({ where });
    } catch (error) {
      logMessage.bookingErrorMessage('eventBookingRefund', { error });
      throw Error(error);
    }
  },

  /**
   * Calculation booking cancellation refund amount
   * @param {Object} req
   */
  async calculateBookingRefundAmount(req) {
    try {
      const { boatBookingInfo } = req;

      // Calculate refund amount
      const cancellationPolicy = boatBookingInfo?.cancellationPolicy;
      const refundAmount = await this.calculateRefundAmount(boatBookingInfo, cancellationPolicy, 'boat');
      const data = {
        refundAmount,
        Receiver: boatBookingInfo?.user?.email,
      };
      return data;
    } catch (error) {
      logMessage.bookingErrorMessage('calculateBookingRefundAmount', { error });
      throw (error.errorCode) ? error : Error(error);
    }
  },

  /**
   * Calculation event booking cancellation refund amount
   * @param {Object} req
   */
  async calculateEventBookingRefundAmount(req) {
    try {
      const { eventBookingInfo } = req;

      // Calculate refund amount
      const cancellationPolicy = eventBookingInfo?.event?.cancellationPolicy;
      const refundAmount = await this.calculateRefundAmount(eventBookingInfo, cancellationPolicy, 'event');
      const data = {
        refundAmount,
        Receiver: eventBookingInfo?.user?.email,
      };
      return data;
    } catch (error) {
      logMessage.bookingErrorMessage('calculateEventBookingRefundAmount', { error });
      throw (error.errorCode) ? error : Error(error);
    }
  },

  /**
   * Delete Pending Boat Bookings
   */
  async removePendingBoatBooking() {
    try {
      const where = {
        status: bookingConstant.BOAT_BOOKING_PAYMENT_STATUS.REQUIRES_PAYMENT,
      };
      const boatPayment = await bookingPayment.findAll({ where });
      await boatPayment.forEach(async (element) => {
        const bookingData = await booking.findOne({ where: { id: element.bookingId } });
        await this.bookingLog(bookingConstant.BOOKING_LOG_TYPE.BOAT, bookingData, element);
        await bookingPayment.destroy({ where: { id: element.id } });
        await booking.destroy({ where: { id: element.bookingId } });
      });
    } catch (error) {
      throw Error(error);
    }
  },

  /**
   * Delete Pending Event Bookings
   */
  async removePendingEventBooking() {
    try {
      const where = {
        status: bookingConstant.BOAT_BOOKING_PAYMENT_STATUS.REQUIRES_PAYMENT,
      };
      const eventPayment = await eventBookingPayment.findAll({ where });
      await eventPayment.forEach(async (element) => {
        const bookingData = await eventBooking.findOne({ where: { id: element.bookingId } });
        await this.bookingLog(bookingConstant.BOOKING_LOG_TYPE.EVENT, bookingData, element);
        await eventBookingPayment.destroy({ where: { id: element.id } });
        await eventBooking.destroy({ where: { id: element.bookingId } });
      });
    } catch (error) {
      throw Error(error);
    }
  },

  /**
   * Booking Log Maintainer create
   */
  async bookingLog(type, bookingData, paymentData) {
    const data = {
      type,
      bookingDetail: JSON.stringify(bookingData),
      paymentDetail: JSON.stringify(paymentData),
    };
    await bookingLog.create(data);
  },

  /**
   * Booking Log Maintainer delete
   */
  async removeBookingLog() {
    await bookingLog.destroy({ where: { createdAt: { [Op.lte]: utility.getSubtractDate() } } });
  },

};
