import utility from '../services/utility';
import logger from '../services/logger';

export default {
  notificationErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'notificationAdd':
        message = `notification add error: ${error}, payload: ${payload}`;
        break;
      case 'notificationList':
        message = `notification list error: ${error}, payload: ${payload}`;
        break;
      case 'notificationDetails':
        message = `notification details error: ${error}, payload: ${payload}`;
        break;
      case 'notificationCount':
        message = `notification count error: ${error}, payload: ${payload}`;
        break;
      case 'notificationUpdateStatus':
        message = `notification Update status error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `notification error ${error}`;
        break;
    }
    logger.dailyLogger('notificationError').error(new Error(message));
  },
};
