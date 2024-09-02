import HttpStatus from 'http-status';
import repositories from '../../repositories';
import utility from '../../services/utility';

const { boatMakeRepository } = repositories;

export default {
  /**
   * Add boat Make in boat settings
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBoatMake(req, res, next) {
    try {
      const result = await boatMakeRepository.addBoatMake(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_MAKE_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all boat Make list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBoatMakes(req, res, next) {
    try {
      const result = await boatMakeRepository.getBoatMakes(req);
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
   * get Boat Make Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getBoatMakeDetail(req, res, next) {
    try {
      const result = req.boatMakeInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_MAKE_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Boat Make Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateBoatMake(req, res, next) {
    try {
      const result = await boatMakeRepository.updateBoatMake(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BOAT_MAKE_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },
};
