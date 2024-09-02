import models from '../models';
import logMessage from '../logMessages/index';

const { currency } = models;

export default {
  /**
   * Get all currency  list
   * @returns
   */
  async getAllCurrencyList() {
    try {
      return await currency.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      });
    } catch (error) {
      logMessage.currencyErrorMessage('currencyList', {
        error,
      });
      throw Error(error);
    }
  },
};
