import utility from '../services/utility';
import logger from '../services/logger';

export default {
  ownerPageErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'ownerPageAdd':
        message = `Owner page add error: ${error}, payload: ${payload}`;
        break;
      case 'ownerPageList':
        message = `Owner page list error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `Owner page error ${error}`;
        break;
    }
    logger.dailyLogger('ownerPageError').error(new Error(message));
  },
};
