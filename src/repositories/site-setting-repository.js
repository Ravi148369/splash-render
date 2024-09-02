import models from '../models';
import logMessage from '../logMessages';

const { siteSetting } = models;

export default {
  /**
     * Add and Update Site settings
     * @param {Object} req
     */
  async addSiteSetting(req) {
    try {
      const { body } = req;
      const result = await siteSetting.findOne({
      });
      if (!result) {
        return await siteSetting.create(body);
      }
      return await siteSetting.update(body, {
        where: { id: result.dataValues?.id },
      });
    } catch (error) {
      logMessage.siteSettingErrorMessage('siteSettingAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
     * Get Site settings Details
     * @param {Object} where
     */
  async getSiteSetting() {
    try {
      return await siteSetting.findOne({
      });
    } catch (error) {
      logMessage.siteSettingErrorMessage('siteSettingDetails', { error });
      throw Error(error);
    }
  },
};
