import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { favoriteListRepository } = repositories;

export default {
  /**
   * Add Favorite List in admin settings
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addFavoriteList(req, res, next) {
    try {
      const result = await favoriteListRepository.createFavoriteList(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'FAVORITE_LIST_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Favorite List list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getFavoriteLists(req, res, next) {
    try {
      const result = await favoriteListRepository.getFavoriteList(req);
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
   * Update Favorite List
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateFavoriteList(req, res, next) {
    try {
      const result = await favoriteListRepository.updateFavoriteList(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'FAVORITE_LIST_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete Favorite List
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async deleteFavoriteList(req, res, next) {
    try {
      const result = await favoriteListRepository.deleteFavoriteList(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'FAVORITE_LIST_DELETE'),
      });
    } catch (error) {
      next(error);
    }
  },
};
