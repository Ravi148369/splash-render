import utility from '../services/utility';
import logger from '../services/logger';

export default {
  siteSettingErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'siteSettingAdd':
        message = `Site setting add error: ${error}, payload: ${payload}`;
        break;
      case 'siteSettingDetails':
        message = `Site setting detail error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `Site setting error ${error}`;
        break;
    }
    logger.dailyLogger('siteSettingError').error(new Error(message));
  },
};
