import utility from '../services/utility';
import logger from '../services/logger';

export default {
  bannerPageErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'bannerPageAdd':
        message = `bannerPage add error: ${error}, payload: ${payload}`;
        break;
      case 'bannerPageList':
        message = `bannerPage list error: ${error}, payload: ${payload}`;
        break;
      case 'bannerPageDetails':
        message = `bannerPage details error: ${error}, payload: ${payload}`;
        break;
      case 'bannerPageUpdate':
        message = `bannerPage Update error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `bannerPage error ${error}`;
        break;
    }
    logger.dailyLogger('bannerPageError').error(new Error(message));
  },
};
