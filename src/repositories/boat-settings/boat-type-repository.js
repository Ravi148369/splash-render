/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../../models';
import logMessage from '../../logMessages';

const { boatType } = models;

export default {
  /**
   * Add boat type in boat settings
   * @param {Object} req
   */
  async addBoatType(req) {
    try {
      const { body } = req;
      return await boatType.create(body);
    } catch (error) {
      logMessage.boatTypeErrorMessage('boatTypeAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get one boat type
   * @param {Object} where
   */
  async getBoatTypeDetails(where) {
    try {
      return await boatType.findOne({
        where,
      });
    } catch (error) {
      logMessage.boatTypeErrorMessage('boatTypeDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Get list boat type
   * @param {Object} req
   */
  async getBoatTypes(req) {
    try {
      const {
        query: {
          search, sortBy, sortType, limit, offset, scope,
        },
      } = req;
      let userScope = 'activeState';
      const where = {};
      let orderBy = [['createdAt', 'DESC']];
      if (search) {
        where.name = { [Op.like]: `%${search}%` };
      }
      if (sortBy && sortType) {
        orderBy = [[sortBy, sortType]];
      }
      let searchCriteria = {
        where,
        order: orderBy,
      };
      if (scope !== 'all') {
        userScope = '';
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      return await boatType.scope(userScope).findAndCountAll(searchCriteria);
    } catch (error) {
      logMessage.boatTypeErrorMessage('boatTypeList', { error });
      throw Error(error);
    }
  },

  /**
   * Update boat type
   * @param {Object} req
   */
  async updateBoatType(req) {
    try {
      const { body } = req;
      const { id } = req.params;
      return await boatType.update(body, { where: { id } });
    } catch (error) {
      logMessage.boatTypeErrorMessage('boatTypeUpdate', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },
};
