/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';
import constant from '../constant';
import mediaRepository from './media-repository';

const {
  commonConstant,
} = constant;

const { popularLocation } = models;

export default {
  /**
   * Add Popular location in home page settings
   * @param {Object} req
   */
  async addPopularLocation(req) {
    try {
      const { body } = req;
      await mediaRepository.makeUsedMedias([body.popularLocationImage]);
      return await popularLocation.create(body);
    } catch (error) {
      logMessage.popularLocationErrorMessage('popularLocationAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get specific Popular location
   * @param {Object} where
   */
  async getPopularLocationDetails(where) {
    try {
      return await popularLocation.findOne({
        where,
      });
    } catch (error) {
      logMessage.popularLocationErrorMessage('popularLocationDetails', {
        error,
      });
      throw Error(error);
    }
  },

  /**
   * Get list of Popular location
   * @param {Object} req
   */
  async getPopularLocations(req) {
    try {
      const {
        query: {
          search, sortBy, sortType, limit, offset,
        },
      } = req;
      const where = {};
      let orderBy = [['createdAt', 'DESC']];
      const sortFields = [
        'id',
        'location',
        'locationAddress',
        'status',
      ];
      if (search) {
        where.location = { [Op.like]: `%${search}%` };
      }
      if (
        sortBy
        && sortType
        && sortFields.includes(sortBy)
      ) {
        orderBy = [[sortBy, sortType]];
      }
      return await popularLocation.findAndCountAll({
        where,
        order: orderBy,
        limit: parseInt(limit || 10),
        offset: parseInt(offset || 0),
      });
    } catch (error) {
      logMessage.popularLocationErrorMessage('popularLocationList', {
        error,
      });
      throw Error(error);
    }
  },

  /**
   * Get list of Popular location for user
   * @param {Object} req
   */
  async getUserPopularLocations(req) {
    try {
      const {
        query: {
          limit, offset,
        },
      } = req;
      const where = { status: commonConstant.STATUS.ACTIVE };
      const orderBy = [['createdAt', 'DESC']];
      return await popularLocation.findAndCountAll({
        where,
        order: orderBy,
        limit: parseInt(limit || 10),
        offset: parseInt(offset || 0),
      });
    } catch (error) {
      logMessage.popularLocationErrorMessage('popularLocationList', {
        error,
      });
      throw Error(error);
    }
  },

  /**
   * Update Popular location
   * @param {Object} req
   */
  async updatePopularLocation(req) {
    try {
      const { body, params: { id } } = req;
      await mediaRepository.makeUsedMedias([body.popularLocationImage]);
      return await popularLocation.update(body, { where: { id } });
    } catch (error) {
      logMessage.popularLocationErrorMessage('popularLocationUpdate', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Update Popular location Status
   * @param {object} data
   * @returns
   */
  async updatePopularLocationStatus(data) {
    try {
      const where = { id: data.id };
      const popularLocationData = await popularLocation.findOne({ where });

      const popularLocationStatus = data.status;
      return await popularLocationData.update({
        status: popularLocationStatus,
      });
    } catch (error) {
      logMessage.popularLocationErrorMessage('popularLocationUpdateStatus', {
        error,
        data,
      });
      throw Error(error);
    }
  },

  /**
   * Delete Popular Location
   * @param {Object} req
   */
  async deletePopularLocation(req) {
    try {
      const { params: { id } } = req;
      return await popularLocation.destroy({ where: { id } });
    } catch (error) {
      logMessage.popularLocationErrorMessage('deletePopularLocation', { error });
      throw Error(error);
    }
  },
};
