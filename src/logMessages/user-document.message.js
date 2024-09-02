import utility from '../services/utility';
import logger from '../services/logger';

export default {
  userDocumentErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'userDocumentAdd':
        message = `user document add error: ${error}, payload: ${payload}`;
        break;
      case 'userDocumentList':
        message = `user document list error: ${error}, payload: ${payload}`;
        break;
      case 'userDocumentUpdateStatus':
        message = `user document Update status error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `user Document error ${error}`;
        break;
    }
    logger.dailyLogger('userDocumentError').error(new Error(message));
  },
};
