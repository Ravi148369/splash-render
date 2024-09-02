import HttpStatus from 'http-status';
import repositories from '../../repositories';
import utility from '../../services/utility';

const { boatTypeRepository } = repositories;

export default {
  /**
   * Add boat type in boat settings
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBoatType(req, res, next) {
    try {
      const result = await boatTypeRepository.addBoatType(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_TYPE_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all boat type list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBoatTypes(req, res, next) {
    try {
      const result = await boatTypeRepository.getBoatTypes(req);
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
   * get Boat Type Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getBoatTypeDetail(req, res, next) {
    try {
      const result = req.boatTypeInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_TYPE_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Boat Type Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateBoatType(req, res, next) {
    try {
      const result = await boatTypeRepository.updateBoatType(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BOAT_TYPE_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },
};
