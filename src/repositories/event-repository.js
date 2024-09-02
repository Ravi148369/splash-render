/* eslint-disable array-callback-return */
/* eslint-disable radix */
import { Op, Sequelize } from 'sequelize';
import constant from '../constant';
import subQuery from '../helpers';
import logMessage from '../logMessages/index';
import models from '../models';
import Email from '../services/email';
import utility from '../services/utility';
import mediaRepository from './media-repository';

const { eventConstant, commonConstant } = constant;
const {
  event, eventImage, boat, boatImage, eventBookingPayment, booking, eventBooking
} = models;

export default {
  /**
   * createEvent
   * @param {Object} req
   * @returns
   */
  async createEvent(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const { body, user, boatInfo } = req;
      body.createdBy = user.id;
      body.cancellationPolicy = boatInfo?.cancellationPolicy;
      body.eventDate = utility.convertFormat(body.eventDate);
      const eventData = await event.create(body, { transaction });

      const eventImagesPaths = body.eventImages;
      const eventImagesData = [];
      const eventImageLinks = [];
      eventImagesPaths.map((item) => {
        eventImageLinks.push(item.image);
        eventImagesData.push({
          eventId: eventData.id,
          image: item.image,
          coverImage: item.cover_image,
        });
      });
      if (eventImagesData.length > 0) {
        await mediaRepository.makeUsedMedias(eventImageLinks, transaction);
        await eventImage.bulkCreate(eventImagesData, { transaction });
      }

      await transaction.commit();
      return eventData;
    } catch (error) {
      console.log(error);

      await transaction.rollback();
      logMessage.eventErrorMessage('eventAdd', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Get list of event
   * @param {Object} req
   */
  async getEvents(req) {
    try {
      const {
        query: {
          limit, offset, type, sortBy, sortType,
          search, latitude, longitude, fromDate, toDate,
        },
      } = req;
      const sortFields = [
        'eventName',
        'boat',
        'location',
        'date',
        'eventType',
        'numberOfAttendee',
        'hostedBy',
      ];
      const where = {};
      let orderBy = [['createdAt', 'DESC']];
      const timezone = req.headers.timezone ? req.headers.timezone : 'Asia/Kolkata';
      // eslint-disable-next-line max-len
      const today = utility.getCurrentDateTimeByTimezone(commonConstant.DATE_TIME_FORMATE.DATE_AND_TIME, timezone);
      const todayData = utility.currentStartEndTimeByTimezone(timezone);
      if (search) {
        where.name = { [Op.like]: `%${search}%` };
      }
      if (type) {
        if (type === eventConstant.GET_EVENT_TYPE.UPCOMING) {
          where.eventDate = { [Op.gt]: today };
          where.status = { [Op.ne]: 'cancelled' }
        }
        if (type === eventConstant.GET_EVENT_TYPE.ONGOING) {
          // eslint-disable-next-line max-len
          where.eventDate = { [Op.and]: [{ [Op.gte]: todayData.todayStartTime }, { [Op.lte]: todayData.todayEndTime }] };
          where.status = { [Op.ne]: 'cancelled' }
        }
        if (type === eventConstant.GET_EVENT_TYPE.PAST) {
          // where.status = { [Op.ne]: 'cancelled' }
          where.eventDate = { [Op.lt]: todayData.todayStartTime };
        }
        if (type === eventConstant.GET_EVENT_TYPE.CANCELLED) {
          where.status = "cancelled";
        }
      }
      if (sortBy && sortType && sortFields.includes(sortBy)) {
        switch (sortBy) {
          case 'eventName':
            orderBy = [['name', sortType]];
            break;
          case 'boat':
            orderBy = [[{ model: boat }, 'name', sortType]];
            break;
          case 'date':
            orderBy = [['eventDate', sortType]];
            break;
          default:
            orderBy = [[sortBy, sortType]];
            break;
        }
      }
      if (latitude && longitude) {
        where.id = subQuery.getEventByLocation(latitude, longitude);
      }
      if (fromDate && toDate) {
        const startDate = utility.convertFormat(fromDate);
        const endDate = utility.convertFormat(toDate);
        where.eventDate = { [Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }] };
      }
      const searchCriteria = {
        where,
        order: orderBy,
      };
      const eventList = [{ method: ['eventList'] }];
      const rowCount = await event.scope(eventList).findAll(searchCriteria);
      searchCriteria.limit = parseInt(limit || 10);
      searchCriteria.offset = parseInt(offset || 0);
      const eventResult = await event.scope(eventList).findAll(searchCriteria);
      const data = {
        count: rowCount.length,
        rows: eventResult,
      };
      return data;
    } catch (error) {
      logMessage.eventErrorMessage('eventList', { error });
      throw Error(error);
    }
  },

  /**
   * Get specific event
   * @param {Object} where
   */
  async getEventDetails(where) {
    try {
      return await event.findOne({
        where,
        include: [
          {
            model: boat,
            as: 'boat',
            include: [
              {
                model: boatImage,
                required: false,
              },
            ],
            required: false,
          },
          {
            model: eventImage,
            required: false,
          },
        ],
      });
    } catch (error) {
      logMessage.eventErrorMessage('eventDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Update event details
   * @param {Object} req
   */
  async updateEvent(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const { body: { eventImages }, eventInfo } = req;
      const eventImagesPaths = eventImages;
      const eventImagesData = [];
      const eventImagesLinks = [];

      req.body.eventDate = utility.convertFormat(req.body.eventDate)
      req.body.prevEventDate = utility.convertFormat(req.body.prevEventDate)

      // delete req.body.eventDate;
      const bookingDate = req.body.eventDate
      const eventData = await eventInfo.update(req.body, { transaction });
      eventImagesPaths.map((item) => {
        eventImagesLinks.push(item.image);
        eventImagesData.push({
          eventId: eventData.id,
          image: item.image,
          coverImage: item.cover_image,
        });
      });
      await eventImage.destroy({ where: { eventId: eventData.id }, transaction });
      if (eventImagesData && eventImagesData.length > 0) {
        await mediaRepository.makeUsedMedias(eventImagesLinks, transaction);
        await eventImage.bulkCreate(eventImagesData, { transaction });
      }

      // updating the booking table for the same event date
      await booking.update(
        {
          bookingDate,
          startTime: Sequelize.fn('DATE_FORMAT',
            Sequelize.fn('CONCAT',
              Sequelize.fn('DATE', bookingDate), ' ', Sequelize.fn('TIME', Sequelize.col('start_time'))
            ), '%Y-%m-%d %H:%i:%s'
          ),
          endTime: Sequelize.fn('DATE_FORMAT',
            Sequelize.fn('CONCAT',
              Sequelize.fn('DATE', bookingDate), ' ', Sequelize.fn('TIME', Sequelize.col('end_time'))
            ), '%Y-%m-%d %H:%i:%s'
          )
        },
        {
          where: {
            boatId: eventInfo?.boatId,
            [Sequelize.Op.and]: [
              Sequelize.where(Sequelize.fn('DATE', Sequelize.col('booking_date')), req.body.prevEventDate)
            ]
          },
          transaction
        }
      )

      const usersBoughtTicket = await eventBooking.findAll({
        where: {
          eventId: eventInfo.id
        },
        transaction
      })
      const emailData = {
        message: `We are excited to announce that the ${eventInfo?.name} originally scheduled for ${utility.formatDate(req.body.prevEventDate)} has been rescheduled to ${utility.formatDate(bookingDate)}.`,
        subject: `Important Update: ${eventInfo?.name} rescheduled`
      }

      if(utility.formatDate(req.body.prevEventDate) !== utility.formatDate(bookingDate)) {
        this.sendEmailToUsersWhoBoughtTicket(usersBoughtTicket, Email.eventRescheduled, emailData)
      }

      await transaction.commit();
      return eventData;
    } catch (error) {
      await transaction.rollback();
      logMessage.eventErrorMessage('eventUpdate', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Get event booking transaction list
   * @param {object} req
   * @returns
   */
  async getEventBookingTransaction(req) {
    try {
      const {
        query: {
          limit, offset, search,
        },
      } = req;
      const where = {};
      if (search) {
        where['$event.name$'] = { [Op.like]: `%${search}%` };
      }
      const transaction = [{ method: ['transaction'] }];
      const transactionList = await eventBookingPayment.scope(transaction).findAll({ where });
      const transactionData = await eventBookingPayment.scope(transaction).findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit || 10),
        offset: parseInt(offset || 0),
      });
      const data = {
        count: transactionList?.length,
        rows: transactionData,
      };
      return data;
    } catch (error) {
      logMessage.eventErrorMessage('eventBookingTransaction', { error });
      throw Error(error);
    }
  },

  /**
   * Send email to user who bought ticket
   * @param {object} req
   * @returns
   */
  async sendEmailToUsersWhoBoughtTicket(users, fn, data) {
    for (const user of users) {
      try {
        const emailData = {
          subject: data.subject,
          message: data.message,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
        await fn(emailData);
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
        throw Error(error);
      }
    }
  },

  /**
   * Delete event
   * @param {object} req
   * @returns
   */
  async cancelEvent(req) {
    try {
      const transaction = await models.sequelize.transaction();
      const { reason } = req.body;
      const { eventInfo } = req

      await event.update(
        { status: 'cancelled', cancelReason: reason, canceledAt: new Date() },
        { where: { id: req.params.id } },
        transaction
      );

      await eventBooking.update(
        { status: 'cancelled', canceledBy: 1 },
        { where: { eventId: req.params.id } },
        transaction
      );

      const usersBoughtTicket = await eventBooking.findAll({
        where: { eventId: req.params.id },
        transaction
      })

      // // sending email to all the users who bought the tickets
      const emailData = {
        subject: `Important Notice: ${eventInfo?.name} cancelled`,
        message: `We regret to inform you that your ${eventInfo?.name} on ${utility.formatDate(eventInfo?.eventDate)} has been canceled due to ${reason}.`
      }

      this.sendEmailToUsersWhoBoughtTicket(usersBoughtTicket, Email.eventCancelled, emailData)

      // getting all the event based on page query params offset and page_size
      const data = await this.getEvents(req);
      return data
      return {}
    } catch (error) {
      await transaction.rollback();
      logMessage.eventErrorMessage('eventUpdate', { error, data: req?.body });
      throw Error(error);
    }
  }
};
