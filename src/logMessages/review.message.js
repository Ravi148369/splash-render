import utility from '../services/utility';
import logger from '../services/logger';

export default {
  reviewErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'adminReviewAdd':
        message = `Admin review add error: ${error}, payload: ${payload}`;
        break;
      case 'reviewAdd':
        message = `User review add error: ${error}, payload: ${payload}`;
        break;
      case 'adminReviewList':
        message = `Admin review list error: ${error}, payload: ${payload}`;
        break;
      case 'reviewList':
        message = `review list error: ${error}, payload: ${payload}`;
        break;
      case 'adminReviewDetails':
        message = `Admin review details error: ${error}, payload: ${payload}`;
        break;
      case 'adminReviewUpdate':
        message = `Admin review update error: ${error}, payload: ${payload}`;
        break;
      case 'adminReviewUpdateStatus':
        message = `Admin review update status error: ${error}, payload: ${payload}`;
        break;
      case 'adminReviewDelete':
        message = `Admin review delete error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `Admin review error ${error}`;
        break;
    }
    logger.dailyLogger('reviewError').error(new Error(message));
  },
};
