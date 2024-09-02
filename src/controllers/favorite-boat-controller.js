import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { favoriteBoatRepository } = repositories;

export default {
  /**
   * Add user's Favorite Boat
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addFavoriteBoat(req, res, next) {
    try {
      const result = await favoriteBoatRepository.createFavoriteBoat(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'FAVORITE_BOAT_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },
};
