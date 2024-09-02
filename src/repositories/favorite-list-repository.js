import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';

const {
  favoriteList, favoriteBoat, boat, boatImage,
} = models;

export default {
  /**
   * Add Favorite List
   * @param {Object} req
   */
  async createFavoriteList(req) {
    try {
      const {
        body,
        user: { id },
      } = req;
      body.userId = id;
      return await favoriteList.create(body);
    } catch (error) {
      logMessage.favoriteListErrorMessage('favoriteListAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get Favorite List
   * @param {Object} req
   */
  async getFavoriteList(req) {
    try {
      const {
        user: { id },
      } = req;
      const queryData = req.query;
      const where = { userId: id };
      let orderBy = [['createdAt', 'DESC']];
      if (queryData.search) {
        where.name = { [Op.like]: `%${queryData.search}%` };
      }
      if (queryData.sortBy && queryData.sortType) {
        orderBy = [[queryData.sortBy, queryData.sortType]];
      }
      return await favoriteList.findAndCountAll({
        where,
        include: [
          {
            model: favoriteBoat,
            include: [
              {
                model: boat,
                include: [
                  {
                    model: boatImage,
                    required: false,
                  },
                ],
                required: false,
              },
            ],
            required: false,
          },
        ],
        order: orderBy,
      });
    } catch (error) {
      logMessage.favoriteListErrorMessage('favoriteList', { error });
      throw Error(error);
    }
  },

  /**
   * Get Favorite List Details
   * @param {Object} where
   */
  async getFavoriteListDetails(where) {
    try {
      return await favoriteList.findOne({
        where,
      });
    } catch (error) {
      logMessage.favoriteListErrorMessage('favoriteListDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Update Favorite List
   * @param {Object} req
   */
  async updateFavoriteList(req) {
    try {
      const { params: { id }, body } = req;
      return await favoriteList.update(body, { where: { id } });
    } catch (error) {
      logMessage.favoriteListErrorMessage('updateFavoriteList', { error });
      throw Error(error);
    }
  },

  /**
   * Delete Favorite List
   * @param {Object} req
   */
  async deleteFavoriteList(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const { params: { id } } = req;
      const where = { listId: id };
      await favoriteBoat.destroy({ where }, { transaction });
      const favoriteListData = await favoriteList.destroy({ where: { id } }, { transaction });
      await transaction.commit();
      return favoriteListData;
    } catch (error) {
      await transaction.rollback();
      logMessage.favoriteListErrorMessage('deleteFavoriteList', { error });
      throw Error(error);
    }
  },
};
