import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { notificationRepository } = repositories;

export default {
  /**
   * Get notificationList list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async notificationList(req, res, next) {
    try {
      const result = await notificationRepository.notificationList(req);
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
   * get event Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getNotificationDetail(req, res, next) {
    try {
      const result = req.notificationInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'NOTIFICATION_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Read Status of notification
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateReadStatus(req, res, next) {
    try {
      const result = await notificationRepository.updateReadStatus(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'NOTIFICATION_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Notification UnRead Count
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async notificationUnReadCount(req, res, next) {
    try {
      const result = await notificationRepository.notificationUnReadCount(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'NOTIFICATION_UNREAD_COUNT'),
      });
    } catch (error) {
      next(error);
    }
  },
};
