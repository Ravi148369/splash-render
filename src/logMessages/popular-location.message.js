import utility from '../services/utility';
import logger from '../services/logger';

export default {
  popularLocationErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'popularLocationAdd':
        message = `popularLocation add error: ${error}, payload: ${payload}`;
        break;
      case 'popularLocationList':
        message = `popularLocation list error: ${error}, payload: ${payload}`;
        break;
      case 'popularLocationDetails':
        message = `popularLocation details error: ${error}, payload: ${payload}`;
        break;
      case 'popularLocationUpdate':
        message = `popularLocation Update error: ${error}, payload: ${payload}`;
        break;
      case 'popularLocationUpdateStatus':
        message = `popularLocation Update status error: ${error}, payload: ${payload}`;
        break;
      case 'deletePopularLocation':
        message = `popularLocation delete error: ${error}`;
        break;
      default:
        message = `popularLocation error ${error}`;
        break;
    }
    logger.dailyLogger('popularLocationError').error(new Error(message));
  },
};
