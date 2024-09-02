import utility from '../services/utility';
import logger from '../services/logger';

export default {
  blogErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'blogAdd':
        message = `blog add error: ${error}, payload: ${payload}`;
        break;
      case 'blogList':
        message = `blog list error: ${error}, payload: ${payload}`;
        break;
      case 'blogDetails':
        message = `blog details error: ${error}, payload: ${payload}`;
        break;
      case 'blogUpdate':
        message = `blog Update error: ${error}, payload: ${payload}`;
        break;
      case 'blogUpdateStatus':
        message = `blog Update status error: ${error}, payload: ${payload}`;
        break;
      case 'blogDelete':
        message = `blog delete error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `blog error ${error}`;
        break;
    }
    logger.dailyLogger('blogError').error(new Error(message));
  },
};
