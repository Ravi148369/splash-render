import utility from '../services/utility';
import logger from '../services/logger';

export default {
  salesTaxErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'salesTaxAdd':
        message = `Sales Tax add error: ${error}, payload: ${payload}`;
        break;
      case 'salesTaxList':
        message = `Sales Tax Details error: ${error}, payload: ${payload}`;
        break;
      case 'salesTaxUpdate':
        message = `Sales Tax Details error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `Sales Tax error ${error}`;
        break;
    }
    logger.dailyLogger('salesTaxError').error(new Error(message));
  },
};
