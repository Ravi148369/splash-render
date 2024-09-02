import models from '../models';
import logMessage from '../logMessages/index';

const { language } = models;

export default {
  /**
   * Get all language  list
   * @returns
   */
  async getAllLanguageList() {
    try {
      return await language.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
    } catch (error) {
      logMessage.languageErrorMessage('languageList', {
        error,
      });
      throw Error(error);
    }
  },
};
