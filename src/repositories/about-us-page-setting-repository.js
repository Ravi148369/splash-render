import models from '../models';
import logMessage from '../logMessages/index';
import mediaRepository from './media-repository';

const { aboutUsPageSetting } = models;

export default {
  /**
   * Add and Update AboutUs Page Setting in site settings
   * @param {Object} req
   */
  async addAboutUsPageSetting(req) {
    try {
      const { body } = req;
      const where = { type: body.type };
      await mediaRepository.makeUsedMedias([body.aboutUsPageImage]);
      const result = await aboutUsPageSetting.findOne({
        where,
      });
      if (!result) {
        return await aboutUsPageSetting.create(body);
      }
      return await aboutUsPageSetting.update(body, {
        where: { id: result.dataValues?.id, type: body.type },
      });
    } catch (error) {
      logMessage.aboutUsPageErrorMessage('aboutUsPageAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get AboutUs page settings list and filter by type
   * @param {Object} where
   */
  async getAboutUsPageSetting(req) {
    try {
      const queryData = req.query;
      const where = {};
      if (queryData.type) {
        where.type = queryData.type;
      }
      return await aboutUsPageSetting.findAndCountAll({
        where,
      });
    } catch (error) {
      logMessage.aboutUsPageErrorMessage('aboutUsPageList', { error });
      throw Error(error);
    }
  },
};
