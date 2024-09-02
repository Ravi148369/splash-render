import HttpStatus from 'http-status';
import repositories from '../../repositories';
import utility from '../../services/utility';

const { boatYearRepository } = repositories;

export default {
  /**
   * Add boat Year in boat settings
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBoatYear(req, res, next) {
    try {
      const result = await boatYearRepository.addBoatYear(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_YEAR_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all boat Year list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBoatYears(req, res, next) {
    try {
      const result = await boatYearRepository.getBoatYears(req);
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
   * get Boat Year Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getBoatYearDetail(req, res, next) {
    try {
      const result = req.boatYearInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_YEAR_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Boat Year Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateBoatYear(req, res, next) {
    try {
      const result = await boatYearRepository.updateBoatYear(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BOAT_YEAR_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },
};
