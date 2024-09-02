import HttpStatus from 'http-status';
import repositories from '../repositories';

const { stateRepository } = repositories;

export default {
  /**
   * Get all state list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getAllState(req, res, next) {
    try {
      const result = await stateRepository.getAllState(req);
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
   * Get state list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getStates(req, res, next) {
    try {
      const result = await stateRepository.getStates(req);
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
