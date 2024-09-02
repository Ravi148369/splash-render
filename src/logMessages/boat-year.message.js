import utility from '../services/utility';
import logger from '../services/logger';

export default {
  boatYearErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'boatYearAdd':
        message = `boat year add error: ${error}, payload: ${payload}`;
        break;
      case 'boatYearList':
        message = `boat year list error: ${error}, payload: ${payload}`;
        break;
      case 'boatYearDetails':
        message = `boat year details error: ${error}, payload: ${payload}`;
        break;
      case 'boatYearUpdate':
        message = `boat year Update error: ${error}, payload: ${payload}`;
        break;
      case 'boatYearUpdateStatus':
        message = `boat year Update status error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `boat year error ${error}`;
        break;
    }
    logger.dailyLogger('boatYearError').error(new Error(message));
  },
};
