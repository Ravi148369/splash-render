import utility from '../services/utility';
import logger from '../services/logger';

export default {
  reportErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'userReportAdd':
        message = `User Report add error: ${error}, payload: ${payload}`;
        break;
      case 'reportList':
        message = `Report list error: ${error}, payload: ${payload}`;
        break;
      case 'reportDetail':
        message = `Report detail error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `Owner page error ${error}`;
        break;
    }
    logger.dailyLogger('reportError').error(new Error(message));
  },
};
