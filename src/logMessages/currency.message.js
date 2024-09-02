import utility from '../services/utility';
import logger from '../services/logger';

export default {
  currencyErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'currencyList':
        message = `currency list error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `currency error ${error}`;
        break;
    }
    logger.dailyLogger('currencyError').error(new Error(message));
  },
};
