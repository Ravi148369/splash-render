import HttpStatus from 'http-status';
import { Op } from 'sequelize';
import repositories from '../repositories';
import utility from '../services/utility';

const { popularLocationRepository } = repositories;

export default {
  /**
   * Check duplicate  Popular Location Exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async duplicatePopularLocationExists(req, res, next) {
    try {
      const where = {};
      const { location } = req.body;
      if (req.params.id) {
        where.location = location;
        where.id = { [Op.ne]: req.params.id };
      } else {
        where.location = location;
      }
      const result = await popularLocationRepository.getPopularLocationDetails(
        where,
      );
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'POPULAR_LOCATION_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Popular Location exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkPopularLocationExists(req, res, next) {
    try {
      const { id } = req.params;
      const result = await popularLocationRepository.getPopularLocationDetails({
        id,
      });
      if (result) {
        req.popularLocationInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'POPULAR_LOCATION_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
