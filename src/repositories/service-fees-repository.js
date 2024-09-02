import models from '../models';
import logMessage from '../logMessages';

const { serviceFees } = models;

export default {
  /**
   * Add and Update Manage service fees in admin settings
   * @param {Object} req
   */
  async addServiceFees(req) {
    try {
      const { body } = req;
      const result = await serviceFees.findOne({});
      if (!result) {
        return await serviceFees.create(body);
      }
      return await serviceFees.update(body, {
        where: { id: result.id },
      });
    } catch (error) {
      logMessage.serviceFeesErrorMessage('serviceFeesAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get Service Fees
   * @param {Object} where
   */
  async getServiceFees() {
    try {
      return await serviceFees.findOne({});
    } catch (error) {
      logMessage.serviceFeesErrorMessage('serviceFeesDetails', { error });
      throw Error(error);
    }
  },
};
