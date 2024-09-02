import utility from '../services/utility';
import logger from '../services/logger';

export default {
  boatMakeErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'boatMakeAdd':
        message = `boat make add error: ${error}, payload: ${payload}`;
        break;
      case 'boatMakeList':
        message = `boat make list error: ${error}, payload: ${payload}`;
        break;
      case 'boatMakeDetails':
        message = `boat make details error: ${error}, payload: ${payload}`;
        break;
      case 'boatMakeUpdate':
        message = `boat make Update error: ${error}, payload: ${payload}`;
        break;
      case 'boatMakeUpdateStatus':
        message = `boat make Update status error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `boat make error ${error}`;
        break;
    }
    logger.dailyLogger('boatMakeError').error(new Error(message));
  },
};
