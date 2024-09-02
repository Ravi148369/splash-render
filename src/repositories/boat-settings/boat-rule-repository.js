/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../../models';
import logMessage from '../../logMessages';
import constant from '../../constant';

const { commonConstant } = constant;
const { boatRule } = models;

export default {
  /**
   * Add boat Rule in boat settings
   * @param {Object} req
   */
  async addBoatRule(req) {
    try {
      const { body } = req;
      return await boatRule.create(body);
    } catch (error) {
      logMessage.boatRuleErrorMessage('boatRuleAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get one boat Rule
   * @param {Object} where
   */
  async getBoatRuleDetails(where) {
    try {
      return await boatRule.findOne({
        where,
      });
    } catch (error) {
      logMessage.boatRuleErrorMessage('boatRuleDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Get list boat Rule
   * @param {Object} req
   */
  async getBoatRules(req) {
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
      return await boatRule.scope(userScope).findAndCountAll(searchCriteria);
    } catch (error) {
      logMessage.boatRuleErrorMessage('boatRuleList', { error });
      throw Error(error);
    }
  },

  /**
   * Update boat Rule
   * @param {Object} req
   */
  async updateBoatRule(req) {
    try {
      const { body } = req;
      const { id } = req.params;
      return await boatRule.update(body, { where: { id } });
    } catch (error) {
      logMessage.boatRuleErrorMessage('boatRuleUpdate', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },
};
