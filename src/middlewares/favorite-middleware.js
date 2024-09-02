import HttpStatus from 'http-status';
import { Op } from 'sequelize';
import repositories from '../repositories';
import utility from '../services/utility';

const { favoriteListRepository, favoriteBoatRepository, favoriteEventRepository } = repositories;

export default {
  /**
   * Check duplicate favorite list name Exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async duplicateFavoriteListExists(req, res, next) {
    try {
      const {
        user,
        body: { name },
        params: { id },
      } = req;
      const where = { userId: user.id };
      if (id) {
        where.name = name;
        where.id = { [Op.ne]: id };
      } else {
        where.name = name;
      }
      const result = await favoriteListRepository.getFavoriteListDetails(where);
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'FAVORITE_LIST_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check favorite boat exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkFavoriteBoatExists(req, res, next) {
    try {
      const {
        body: { boatId },
        user: { id },
      } = req;
      const result = await favoriteBoatRepository.getFavoriteBoatDetails({
        boatId,
        userId: id,
      });
      if (result) {
        req.favoriteExist = {
          isFavorite: true,
          id: result.id,
        };
        next();
      } else {
        req.favoriteExist = {
          isFavorite: false,
        };
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Favorite List exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkFavoriteListExists(req, res, next) {
    try {
      const {
        body: { listId },
        user: { id },
        params,
      } = req;
      const finalListId = listId || params.id;
      const result = await favoriteListRepository.getFavoriteListDetails({
        id: finalListId,
        userId: id,
      });
      if (result) {
        req.favoriteListInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'FAVORITE_LIST_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check favorite event exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkFavoriteEventExists(req, res, next) {
    try {
      const {
        body: { eventId },
        user: { id },
      } = req;
      const result = await favoriteEventRepository.getFavoriteEventDetails({
        eventId,
        userId: id,
      });
      if (result) {
        req.favoriteExist = {
          isFavorite: true,
          id: result.id,
        };
        next();
      } else {
        req.favoriteExist = {
          isFavorite: false,
        };
        next();
      }
    } catch (error) {
      next(error);
    }
  },
};
