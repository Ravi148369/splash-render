import utility from '../services/utility';
import logger from '../services/logger';

export default {
  stateErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'stateList':
        message = `state list error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `state error ${error}`;
        break;
    }
    logger.dailyLogger('stateError').error(new Error(message));
  },
};
