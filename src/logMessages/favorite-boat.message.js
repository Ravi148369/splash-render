import utility from '../services/utility';
import logger from '../services/logger';

export default {
  favoriteBoatErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'favoriteBoatAdd':
        message = `Favorite Boat error: ${error}, payload: ${payload}`;
        break;
      case 'favoriteBoatDetails':
        message = `Favorite Boat Detail error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `Favorite Boat error ${error}`;
        break;
    }
    logger.dailyLogger('favoriteBoatError').error(new Error(message));
  },
};
