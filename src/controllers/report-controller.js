import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { reportRepository } = repositories;

export default {
  /**
   * Add User Reports
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async addReport(req, res, next) {
    try {
      const result = await reportRepository.addReport(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'REPORT_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get User Reports
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getUserReports(req, res, next) {
    try {
      const result = await reportRepository.getUserReports(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: '',
      });
    } catch (error) {
      next(error);
    }
  },
};
