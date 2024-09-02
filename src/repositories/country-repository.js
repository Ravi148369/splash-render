/* eslint-disable radix */
import models from '../models';
import logMessage from '../logMessages/index';

const { country } = models;
const { Op } = models.Sequelize;

export default {
  /**
   * Get all country list
   * @param {Object} req
   * @returns
   */
  async getCountryList(req) {
    try {
      const queryData = req.query;
      const orderBy = [['name', 'ASC']];
      const where = { status: { [Op.in]: ['Active', 'Inactive'] } };
      if (queryData.name) {
        where.name = { [Op.like]: `%${queryData.name}%` };
      }
      const countryScope = [{ method: ['country', where] }];
      return await country.scope(countryScope).findAndCountAll({
        order: orderBy,
      });
    } catch (error) {
      logMessage.countryErrorMessage('countryList', { error });
      throw Error(error);
    }
  },

  /**
   * Get all active country list
   * @param {Object} req
   * @returns
   */
  async getAllCountry(req) {
    try {
      const {
        query: { limit, offset, search },
      } = req;
      let where = {};
      if (search) {
        where = {
          ...where,
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { countryCode: { [Op.like]: `%${search}%` } },
          ],
        };
      }
      const searchCriteria = {
        where,
        limit: parseInt(limit || 10),
        offset: parseInt(offset || 0),
      };
      return await country.scope('activeCountry').findAll(searchCriteria);
    } catch (error) {
      logMessage.countryErrorMessage('countryList', { error });
      throw Error(error);
    }
  },

  /**
   * Get single country detail
   * @param {Object} req
   * @returns
   */
  async getOneCountry(req) {
    try {
      const paramData = req.params;
      const queryData = req.query;
      let countryId = '';
      let result = '';

      if (paramData.countryId) {
        countryId = paramData.countryId;
      } else if (queryData.countryId) {
        countryId = queryData.countryId;
      }
      if (countryId) {
        result = await country.findOne({ where: { id: countryId } });
      }
      return result;
    } catch (error) {
      logMessage.countryErrorMessage('countryDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Update  country
   * @param {Object} data
   * @returns
   */
  async update(countryObj, data) {
    try {
      return await countryObj.update(data);
    } catch (error) {
      logMessage.countryErrorMessage('countryUpdate', {
        error,
        data,
      });
      throw Error(error);
    }
  },
};
