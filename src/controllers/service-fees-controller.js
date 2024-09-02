import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { serviceFeesRepository } = repositories;

export default {
  /**
   * Add and Update Manage service fees in admin settings
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async addServiceFees(req, res, next) {
    try {
      const result = await serviceFeesRepository.addServiceFees(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'SERVICE_FEES_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Service Fees
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getServiceFees(req, res, next) {
    try {
      const result = await serviceFeesRepository.getServiceFees();
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'SERVICE_FEES_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },
};
