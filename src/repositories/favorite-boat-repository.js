import models from '../models';
import logMessage from '../logMessages/index';

const { favoriteBoat } = models;

export default {
  /**
   * Add Favorite Boat
   * @param {Object} req
   */
  async createFavoriteBoat(req) {
    try {
      const {
        body,
        user: { id },
        favoriteExist,
      } = req;
      body.userId = id;
      if (favoriteExist.isFavorite === false) {
        return await favoriteBoat.create(body);
      }
      if (favoriteExist.isFavorite === true) {
        const where = { id: favoriteExist.id };
        return await favoriteBoat.destroy({ where });
      }
      return true;
    } catch (error) {
      logMessage.favoriteBoatErrorMessage('favoriteBoatAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get Favorite List Details
   * @param {Object} where
   */
  async getFavoriteBoatDetails(where) {
    try {
      return await favoriteBoat.findOne({
        where,
      });
    } catch (error) {
      logMessage.favoriteListErrorMessage('favoriteBoatDetails', { error });
      throw Error(error);
    }
  },
};
