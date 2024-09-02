import Email from '../services/email';
import logMessage from '../logMessages/index';
import models from '../models';

const {
  support, user,
} = models;

export default {
  /**
   * Contact and support email
   * @param {Object} req
   * @returns
   */
  async addSupportEmail(req) {
    try {
      const { body } = req;
      const userData = await user.findOne({ where: { id: 1 } });
      const data = {
        to: userData.email,
        ...body,
      };
      return await Email.contactAndSupport(data)
        .then(async () => ({ status: 'sent', support: await support.create(body) }))
        .catch((error) => ({ status: 'send_error', error }));
    } catch (error) {
      logMessage.accountErrorMessage('otpSend', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },
};
