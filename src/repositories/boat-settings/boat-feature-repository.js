/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../../models';
import logMessage from '../../logMessages';
import constant from '../../constant';

const { commonConstant } = constant;
const { boatFeature } = models;

export default {
  /**
   * Add boat Feature in boat settings
   * @param {Object} req
   */
  async addBoatFeature(req) {
    try {
      const { body } = req;
      return await boatFeature.create(body);
    } catch (error) {
      logMessage.boatFeatureErrorMessage('boatFeatureAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get one boat Feature
   * @param {Object} where
   */
  async findOneBoatFeature(where) {
    try {
      return await boatFeature.findOne({
        where,
      });
    } catch (error) {
      logMessage.boatFeatureErrorMessage('boatFeatureDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Get list boat Feature
   * @param {Object} req
   */
  async getBoatFeatures(req) {
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
      return await boatFeature.scope(userScope).findAndCountAll(searchCriteria);
    } catch (error) {
      logMessage.boatFeatureErrorMessage('boatFeatureList', { error });
      throw Error(error);
    }
  },

  /**
   * Update boat Feature
   * @param {Object} req
   */
  async updateBoatFeature(req) {
    try {
      const { body } = req;
      const { id } = req.params;
      return await boatFeature.update(body, { where: { id } });
    } catch (error) {
      logMessage.boatFeatureErrorMessage('boatFeatureUpdate', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },
};
