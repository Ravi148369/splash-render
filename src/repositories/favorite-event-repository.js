import models from '../models';
import logMessage from '../logMessages/index';

const { favoriteEvent } = models;

export default {
  /**
   * Add Favorite Event
   * @param {Object} req
   */
  async createFavoriteEvent(req) {
    try {
      const {
        body,
        user,
        favoriteExist: { isFavorite, id },
      } = req;
      body.userId = user.id;
      if (isFavorite === false) {
        return await favoriteEvent.create(body);
      }
      if (isFavorite === true) {
        const where = { id };
        return await favoriteEvent.destroy({ where });
      }
      return true;
    } catch (error) {
      logMessage.favoriteEventErrorMessage('favoriteEventAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get Favorite Event list
   * @param {Object} req
   */
  async getFavoriteEvents(req) {
    try {
      const { user: { id } } = req;
      return await favoriteEvent.findAndCountAll({
        where: { userId: id },
      });
    } catch (error) {
      logMessage.favoriteEventErrorMessage('favoriteEventList', { error });
      throw Error(error);
    }
  },

  /**
   * Get Favorite Event Details
   * @param {Object} where
   */
  async getFavoriteEventDetails(where) {
    try {
      return await favoriteEvent.findOne({
        where,
      });
    } catch (error) {
      logMessage.favoriteEventErrorMessage('favoriteEventDetail', { error });
      throw Error(error);
    }
  },
};
