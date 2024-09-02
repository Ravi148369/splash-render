/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../../models';
import logMessage from '../../logMessages';
import constant from '../../constant';

const { commonConstant } = constant;
const { boatYear } = models;

export default {
  /**
   * Add boat Year in boat settings
   * @param {Object} req
   */
  async addBoatYear(req) {
    try {
      const { body } = req;
      return await boatYear.create(body);
    } catch (error) {
      logMessage.boatYearErrorMessage('boatYearDetails', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get one boat Year
   * @param {Object} where
   */
  async getBoatYearDetails(where) {
    try {
      return await boatYear.findOne({
        where,
      });
    } catch (error) {
      logMessage.boatYearErrorMessage('boatFeatureAdd', { error });
      throw Error(error);
    }
  },

  /**
   * Get list boat Year
   * @param {Object} req
   */
  async getBoatYears(req) {
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
        where.year = { [Op.like]: `%${search}%` };
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
      return await boatYear.scope(userScope).findAndCountAll(searchCriteria);
    } catch (error) {
      logMessage.boatYearErrorMessage('boatYearList', { error });
      throw Error(error);
    }
  },

  /**
   * Update boat Year
   * @param {Object} req
   */
  async updateBoatYear(req) {
    try {
      const { body } = req;
      const { id } = req.params;
      return await boatYear.update(body, { where: { id } });
    } catch (error) {
      logMessage.boatYearErrorMessage('boatYearUpdate', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },
};
