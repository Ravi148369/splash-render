import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { reportRepository, boatRepository } = repositories;

export default {
  /**
   * Check all ready report exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkAllReadyReportExist(req, res, next) {
    try {
      const { body: { toUserId }, user: { id } } = req;
      const result = await reportRepository.getUserReportDetails({ toUserId, fromUserId: id });
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'REPORT_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify user owner exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async VerifyUserOwnerExist(req, res, next) {
    try {
      const { body: { toUserId } } = req;
      const result = await boatRepository.findOne({ ownerId: toUserId, status: 'completed' });
      if (result) {
        req.boatInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'REPORT_USER_NOT_OWNER'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
