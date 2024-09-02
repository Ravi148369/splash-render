import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { popularLocationRepository } = repositories;

export default {
  /**
   * Add Popular Location in home page settings
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addPopularLocation(req, res, next) {
    try {
      const result = await popularLocationRepository.addPopularLocation(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'POPULAR_LOCATION_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Popular Location list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getPopularLocations(req, res, next) {
    try {
      const result = await popularLocationRepository.getPopularLocations(req);
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
   * get Popular Location Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getPopularLocationDetail(req, res, next) {
    try {
      const result = req.popularLocationInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'POPULAR_LOCATION_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Popular Location Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updatePopularLocation(req, res, next) {
    try {
      const result = await popularLocationRepository.updatePopularLocation(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'POPULAR_LOCATION_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Popular Location Status
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updatePopularLocationStatus(req, res, next) {
    try {
      const bodyData = {
        id: req.params.id,
        status: req.body.status,
      };
      await popularLocationRepository.updatePopularLocationStatus(bodyData);
      res.status(HttpStatus.OK).json({
        success: true,
        data: [],
        message: utility.getMessage(
          req,
          false,
          'POPULAR_LOCATION_STATUS_UPDATED',
        ),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get list of Popular location for user
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getUserPopularLocations(req, res, next) {
    try {
      const result = await popularLocationRepository.getUserPopularLocations(req);
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
   * Delete Popular Location
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async deletePopularLocation(req, res, next) {
    try {
      const result = await popularLocationRepository.deletePopularLocation(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'POPULAR_LOCATION_DELETE'),
      });
    } catch (error) {
      next(error);
    }
  },
};
