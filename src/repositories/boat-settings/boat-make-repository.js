/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../../models';
import logMessage from '../../logMessages';
import constant from '../../constant';

const { commonConstant } = constant;
const { boatMake } = models;

export default {
  /**
   * Add boat Make in boat settings
   * @param {Object} req
   */
  async addBoatMake(req) {
    try {
      const { body } = req;
      return await boatMake.create(body);
    } catch (error) {
      logMessage.boatMakeErrorMessage('boatMakeAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get one boat Make
   * @param {Object} where
   */
  async getBoatMakeDetails(where) {
    try {
      return await boatMake.findOne({
        where,
      });
    } catch (error) {
      logMessage.boatMakeErrorMessage('boatMakeDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Get list boat Make
   * @param {Object} req
   */
  async getBoatMakes(req) {
    try {
      const {
        query: {
          search, sortBy, sortType, limit, offset, scope,
        }, user,
      } = req;
      const userScope = user.userRole?.role?.dataValues?.role === commonConstant.ROLE.ADMIN ? '' : 'activeState';
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
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      return await boatMake.scope(userScope).findAndCountAll(searchCriteria);
    } catch (error) {
      logMessage.boatMakeErrorMessage('boatMakeList', { error });
      throw Error(error);
    }
  },

  /**
   * Update boat Make
   * @param {Object} req
   */
  async updateBoatMake(req) {
    try {
      const { body } = req;
      const { id } = req.params;
      return await boatMake.update(body, { where: { id } });
    } catch (error) {
      logMessage.boatMakeErrorMessage('boatMakeUpdate', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },
};
