import utility from '../services/utility';
import logger from '../services/logger';

export default {
  favoriteListErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'favoriteListAdd':
        message = `Favorite List add error: ${error}, payload: ${payload}`;
        break;
      case 'favoriteListList':
        message = `Favorite List list error: ${error}, payload: ${payload}`;
        break;
      case 'favoriteListDetails':
        message = `Favorite List details error: ${error}`;
        break;
      case 'updateFavoriteList':
        message = `Favorite List update error: ${error}, payload: ${payload}`;
        break;
      case 'deleteFavoriteList':
        message = `Favorite List delete error: ${error}`;
        break;
      default:
        message = `Favorite List error ${error}`;
        break;
    }
    logger.dailyLogger('favoriteListError').error(new Error(message));
  },
};
