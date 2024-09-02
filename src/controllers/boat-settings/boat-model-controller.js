import HttpStatus from 'http-status';
import repositories from '../../repositories';
import utility from '../../services/utility';

const { boatModelRepository } = repositories;

export default {
  /**
   * Add boat Model in boat settings
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBoatModel(req, res, next) {
    try {
      const result = await boatModelRepository.addBoatModel(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_MODEL_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all boat Model list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBoatModels(req, res, next) {
    try {
      const result = await boatModelRepository.getBoatModels(req);
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
   * get Boat Model Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getBoatModelDetail(req, res, next) {
    try {
      const result = req.boatModelInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_MODEL_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Boat Model Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateBoatModel(req, res, next) {
    try {
      const result = await boatModelRepository.updateBoatModel(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BOAT_MODEL_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },
};
