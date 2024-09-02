import utility from '../services/utility';
import logger from '../services/logger';

export default {
  boatModelErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'boatModelAdd':
        message = `boat model add error: ${error}, payload: ${payload}`;
        break;
      case 'boatModelList':
        message = `boat model list error: ${error}, payload: ${payload}`;
        break;
      case 'boatModelDetails':
        message = `boat model details error: ${error}, payload: ${payload}`;
        break;
      case 'boatModelUpdate':
        message = `boat model Update error: ${error}, payload: ${payload}`;
        break;
      case 'boatModelUpdateStatus':
        message = `boat model Update status error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `boat model error ${error}`;
        break;
    }
    logger.dailyLogger('boatModelError').error(new Error(message));
  },
};
