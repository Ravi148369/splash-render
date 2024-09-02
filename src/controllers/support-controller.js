import HttpStatus from 'http-status';
import utility from '../services/utility';
import repositories from '../repositories';

const { supportRepository, notificationRepository } = repositories;

export default {
  /**
     * Contact and support email
     * @param {object} req
     * @param {object} res
     * @param {function} next
     */
  async addSupportEmail(req, res, next) {
    try {
      const result = await supportRepository.addSupportEmail(req);
      if (result) {
        if (result.status === 'send_error') {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'UNABLE_MAIL_SEND'),
          });
        } else {
          const notificationData = {
            toUserId: 1,
            fromUserId: 1,
            notificationsType: 'contact_support',
            message: await utility.getNotificationMessage(req, { type: 'CONTACT_SUPPORT' }, result?.support),
            customFields: result?.support ? JSON.stringify(result?.support) : null,
          };
          await notificationRepository.addUserNotification(notificationData);
          res.status(HttpStatus.OK).json({
            success: true,
            data: null,
            message: utility.getMessage(req, false, 'CONTACT_AND_SUPPORT_SEND'),
          });
        }
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'EMAIL_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
