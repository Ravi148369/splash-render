import HttpStatus from 'http-status';
import repositories from '../../repositories';
import utility from '../../services/utility';

const { boatFeatureRepository } = repositories;

export default {
  /**
   * Add boat Feature in boat settings
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBoatFeature(req, res, next) {
    try {
      const result = await boatFeatureRepository.addBoatFeature(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_FEATURE_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all boat Feature list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBoatFeatures(req, res, next) {
    try {
      const result = await boatFeatureRepository.getBoatFeatures(req);
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
   * get Boat Feature Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getBoatFeatureDetail(req, res, next) {
    try {
      const result = req.boatFeatureInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_FEATURE_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Boat Feature Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateBoatFeature(req, res, next) {
    try {
      const result = await boatFeatureRepository.updateBoatFeature(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BOAT_FEATURE_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },
};
