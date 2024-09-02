import utility from '../services/utility';
import logger from '../services/logger';

export default {
  serviceFeesErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'serviceFeesAdd':
        message = `Service fees add error: ${error}, payload: ${payload}`;
        break;
      case 'serviceFeesDetails':
        message = `Service fees Details error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `Service fees error ${error}`;
        break;
    }
    logger.dailyLogger('serviceFeesError').error(new Error(message));
  },
};
