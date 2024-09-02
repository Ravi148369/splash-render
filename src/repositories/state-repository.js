/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';

const { state } = models;
export default {
  /**
   * Get all active state list
   * @param {Object} req
   * @returns
   */
  async getAllState(req) {
    try {
      const {
        query: {
          limit, offset, countryId, search,
        },
      } = req;
      let where = {};
      if (search) {
        where = {
          ...where,
          [Op.or]: [{ name: { [Op.like]: `%${search}%` } }],
        };
      }
      if (countryId) {
        where.countryId = countryId;
      }
      let searchCriteria = {
        where,
      };
      if (!countryId) {
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      return await state.scope('notDeletedState').findAll(searchCriteria);
    } catch (error) {
      logMessage.stateErrorMessage('stateList', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Get states
   * @param {Object} req
   */
  async getStates(req) {
    try {
      return await state.findAll({
        where: { country_id: req.params.countryId },
      });
    } catch (error) {
      logMessage.stateErrorMessage('stateList', { error, data: req?.body });
      throw Error(error);
    }
  },
};
