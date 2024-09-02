import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { favoriteEventRepository } = repositories;

export default {
  /**
   * Add user's Favorite Event
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addFavoriteEvent(req, res, next) {
    try {
      const result = await favoriteEventRepository.createFavoriteEvent(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'FAVORITE_EVENT_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user's Favorite Event list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getFavoriteEvents(req, res, next) {
    try {
      const result = await favoriteEventRepository.getFavoriteEvents(req);
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
