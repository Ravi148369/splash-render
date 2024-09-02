/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';
import constant from '../constant';

const { commonConstant } = constant;
const { userNotification } = models;

export default {
  /**
   * Save user notification
   * @param {Object} data
   * @returns
   */
  async addUserNotification(data) {
    try {
      return await userNotification.create(data);
    } catch (error) {
      logMessage.notificationErrorMessage('notificationAdd', {
        error,
        data,
      });
      throw Error(error);
    }
  },

  /**
   * Send bulk notification
   * @param {Object} data
   * @returns
   */
  async addNotifications(data) {
    const transaction = await models.sequelize.transaction();
    try {
      const result = await userNotification.bulkCreate(data, { transaction });

      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      logMessage.notificationErrorMessage('notificationAdd', {
        error,
        data,
      });
      throw Error(error);
    }
  },

  /**
   * Notification list
   * @param {object} req
   * @returns
   */
  async notificationList(req) {
    try {
      const { query: { limit, offset }, user: { id } } = req;
      const order = [['id', 'DESC']];
      const where = {
        toUserId: id,
        status: { [Op.ne]: commonConstant.NOTIFICATION.STATUS.DELETED },
      };
      await userNotification.update(
        { readStatus: commonConstant.NOTIFICATION.READ_STATUS.READ },
        { where },
      );
      const notificationData = [{ method: ['notificationData'] }];
      return await userNotification.scope(notificationData).findAndCountAll({
        where,
        order,
        limit: parseInt(limit || 10),
        offset: parseInt(offset || 0),
      });
    } catch (error) {
      logMessage.notificationErrorMessage('notificationList', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Update read status
   * @param {object} req
   * @returns
   */
  async updateReadStatus(req) {
    try {
      const { user: { id } } = req;
      const whereQuery = {
        toUserId: id,
        status: { [Op.ne]: commonConstant.NOTIFICATION.STATUS.DELETED },
      };
      return await userNotification.update(
        { readStatus: commonConstant.NOTIFICATION.READ_STATUS.READ },
        { where: whereQuery },
      );
    } catch (error) {
      logMessage.notificationErrorMessage('notificationUpdateStatus', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get Notification detail
   * @param {object} req
   * @returns
   */
  async getNotificationDetail(where) {
    try {
      return userNotification.findOne({ where });
    } catch (error) {
      logMessage.notificationErrorMessage('notificationDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Unread notification count
   * @param {object} req
   * @returns
   */
  async notificationUnReadCount(req) {
    try {
      const { user: { id } } = req;
      const where = {
        toUserId: id,
        readStatus: commonConstant.NOTIFICATION.READ_STATUS.UNREAD,
        status: { [Op.ne]: commonConstant.NOTIFICATION.STATUS.DELETED },
      };
      return await userNotification.count({ where });
    } catch (error) {
      logMessage.notificationErrorMessage('notificationCount', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },
};
