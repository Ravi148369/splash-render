import utility from '../services/utility';
import logger from '../services/logger';

export default {
  countryErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'countryList':
        message = `country list error: ${error}, payload: ${payload}`;
        break;
      case 'countryDetails':
        message = `country details error: ${error}, payload: ${payload}`;
        break;
      case 'countryUpdate':
        message = `country Update error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `country error ${error}`;
        break;
    }
    logger.dailyLogger('countryError').error(new Error(message));
  },
};
