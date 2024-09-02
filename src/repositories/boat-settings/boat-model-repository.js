/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../../models';
import logMessage from '../../logMessages';
import constant from '../../constant';

const { commonConstant } = constant;
const { boatModel, boatMake } = models;

export default {
  /**
   * Add boat Model in boat settings
   * @param {Object} req
   */
  async addBoatModel(req) {
    try {
      const { body } = req;
      return await boatModel.create(body);
    } catch (error) {
      logMessage.boatModelErrorMessage('boatModelAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get one boat Model
   * @param {Object} where
   */
  async findOneBoatModel(where) {
    try {
      return await boatModel.findOne({
        where,
        include: [
          {
            model: boatMake,
            required: false,
          },
        ],
      });
    } catch (error) {
      logMessage.boatModelErrorMessage('boatModelDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Get list boat Model
   * @param {Object} req
   */
  async getBoatModels(req) {
    try {
      const where = {};
      const {
        query: {
          search, sortBy, sortType, limit, offset, scope, makeId,
        }, user,
      } = req;
      const userScope = user.userRole?.role?.dataValues?.role === commonConstant.ROLE.ADMIN ? '' : 'activeState';
      let orderBy = [['createdAt', 'DESC']];
      if (makeId) {
        where.makeId = makeId;
      }
      if (search) {
        where.name = { [Op.like]: `%${search}%` };
      }
      if (sortBy && sortType) {
        orderBy = [[sortBy, sortType]];
      }
      let searchCriteria = {
        where,
        include: [
          {
            model: boatMake,
            required: false,
          },
        ],
        order: orderBy,
      };
      if (scope !== 'all') {
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      return await boatModel.scope(userScope).findAndCountAll(searchCriteria);
    } catch (error) {
      logMessage.boatModelErrorMessage('boatModelList', { error });
      throw Error(error);
    }
  },

  /**
   * Update boat Model
   * @param {Object} req
   */
  async updateBoatModel(req) {
    try {
      const { body } = req;
      const { id } = req.params;
      return await boatModel.update(body, { where: { id } });
    } catch (error) {
      logMessage.boatModelErrorMessage('boatModelUpdate', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },
};
