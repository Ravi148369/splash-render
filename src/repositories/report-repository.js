/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';

const { userReport, user } = models;

export default {
  /**
   * Add Report of owner
   * @param {Object} req
   */
  async addReport(req) {
    try {
      const { body, user: { id } } = req;
      body.fromUserId = id;
      return await userReport.create(body);
    } catch (error) {
      logMessage.reportErrorMessage('userReportAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get specific report detail
   * @param {Object} where
   */
  async getUserReportDetails(where) {
    try {
      return await userReport.findOne({
        where,
      });
    } catch (error) {
      logMessage.reportErrorMessage('reportDetail', {
        error,
      });
      throw Error(error);
    }
  },

  /**
   * Get list of user report
   * @param {Object} req
   */
  async getUserReports(req) {
    try {
      const {
        query: {
          search, sortBy, sortType, limit, offset,
        },
      } = req;
      const where = {};
      let orderBy = [['createdAt', 'DESC']];
      if (search) {
        where.reportedType = { [Op.like]: `%${search}%` };
      }
      if (sortBy && sortType) {
        orderBy = [[sortBy, sortType]];
      }
      return await userReport.findAndCountAll({
        where,
        include: [
          {
            model: user,
            as: 'toUser',
            attributes: [
              'id',
              'profileImageUrl',
              'profileImage',
              'firstName',
              'lastName',
              'email',
              'countryCode',
              'phoneNumber',
              'dateOfBirth',
              'whereYouLive',
              'describeYourself',
            ],
            required: true,
          },
          {
            model: user,
            as: 'fromUser',
            attributes: [
              'id',
              'profileImageUrl',
              'profileImage',
              'firstName',
              'lastName',
              'email',
              'countryCode',
              'phoneNumber',
              'dateOfBirth',
              'whereYouLive',
              'describeYourself',
            ],
            required: true,
          },
        ],
        order: orderBy,
        limit: parseInt(limit || 10),
        offset: parseInt(offset || 0),
      });
    } catch (error) {
      logMessage.reportErrorMessage('reportList', {
        error,
      });
      throw Error(error);
    }
  },
};
