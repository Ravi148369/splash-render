import models from '../models';
import logMessage from '../logMessages';
import mediaRepository from './media-repository';

const { ownerPageSetting } = models;

export default {
  /**
   * Add and Update Owner page settings in site settings
   * @param {Object} req
   */
  async addOwnerPageSetting(req) {
    try {
      const { body } = req;
      const where = { type: body.type };
      const result = await ownerPageSetting.findOne({
        where,
      });
      await mediaRepository.makeUsedMedias([body.ownerPageImage]);
      if (!result) {
        return await ownerPageSetting.create(body);
      }
      return await ownerPageSetting.update(body, {
        where: { id: result.dataValues?.id, type: body.type },
      });
    } catch (error) {
      logMessage.ownerPageErrorMessage('ownerPageAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get Owner page settings list and filter by type
   * @param {Object} where
   */
  async getOwnerPageSetting(req) {
    try {
      const queryData = req.query;
      const where = {};
      if (queryData.type) {
        where.type = queryData.type;
      }
      return await ownerPageSetting.findAndCountAll({
        where,
      });
    } catch (error) {
      logMessage.ownerPageErrorMessage('ownerPageList', { error });
      throw Error(error);
    }
  },
};
