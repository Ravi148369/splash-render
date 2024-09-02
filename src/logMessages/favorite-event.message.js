import utility from '../services/utility';
import logger from '../services/logger';

export default {
  favoriteEventErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'favoriteEventAdd':
        message = `Favorite Event error: ${error}, payload: ${payload}`;
        break;
      case 'favoriteEventList':
        message = `Favorite Event List error: ${error}, payload: ${payload}`;
        break;
      case 'favoriteEventDetail':
        message = `Favorite Event Detail error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `Favorite Event error ${error}`;
        break;
    }
    logger.dailyLogger('favoriteEventError').error(new Error(message));
  },
};
