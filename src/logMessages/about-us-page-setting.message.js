import utility from '../services/utility';
import logger from '../services/logger';

export default {
  aboutUsPageErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'aboutUsPageAdd':
        message = `About Us Page add error: ${error}, payload: ${payload}`;
        break;
      case 'aboutUsPageList':
        message = `About Us Page list error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `About Us Page error ${error}`;
        break;
    }
    logger.dailyLogger('aboutUsPageError').error(new Error(message));
  },
};
