import utility from '../services/utility';
import logger from '../services/logger';

export default {
  mediaErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'mediaAdd':
        message = `media add error: ${error}, payload: ${payload}`;
        break;
      case 'findAndRemove':
        message = `all media find and remove error: ${error}, payload: ${payload}`;
        break;
      case 'unlinkMedia':
        message = `thumb image upload error: ${error}, payload: ${payload}`;
        break;
      case 'bulkMediaAdd':
        message = `bulk media add error: ${error}, payload: ${payload}`;
        break;
      case 'mediaList':
        message = `media list error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `media error ${error}`;
        break;
    }
    logger.dailyLogger('mediaError').error(new Error(message));
  },
};
