import HttpStatus from 'http-status';
import { Op } from 'sequelize';
import repositories from '../repositories';
import utility from '../services/utility';
import constant from '../constant';

const { commonConstant } = constant;
const { notificationRepository } = repositories;

export default {
  /**
   * Check Notification exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkNotificationExists(req, res, next) {
    try {
      const { user: { id } } = req;
      const result = await notificationRepository.getNotificationDetail({
        id, status: { [Op.ne]: commonConstant.NOTIFICATION.STATUS.DELETED },
      });
      if (result) {
        req.popularLocationInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'NOTIFICATION_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
