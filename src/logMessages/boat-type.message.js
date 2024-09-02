import utility from '../services/utility';
import logger from '../services/logger';

export default {
  boatTypeErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'boatTypeAdd':
        message = `boat type add error: ${error}, payload: ${payload}`;
        break;
      case 'boatTypeList':
        message = `boat type list error: ${error}, payload: ${payload}`;
        break;
      case 'boatTypeDetails':
        message = `boat type details error: ${error}, payload: ${payload}`;
        break;
      case 'boatTypeUpdate':
        message = `boat type Update error: ${error}, payload: ${payload}`;
        break;
      case 'boatTypeUpdateStatus':
        message = `boat type Update status error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `boat type error ${error}`;
        break;
    }
    logger.dailyLogger('boatTypeError').error(new Error(message));
  },
};
