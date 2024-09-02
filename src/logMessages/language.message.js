import utility from '../services/utility';
import logger from '../services/logger';

export default {
  languageErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'languageList':
        message = `language list error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `language error ${error}`;
        break;
    }
    logger.dailyLogger('languageError').error(new Error(message));
  },
};
