import utility from '../services/utility';
import logger from '../services/logger';

export default {
  staticContentErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'staticContentList':
        message = `static content list error: ${error}, payload: ${payload}`;
        break;
      case 'staticContentDetails':
        message = `static content details error: ${error}, payload: ${payload}`;
        break;
      case 'staticContentUpdate':
        message = `static content Update error: ${error}, payload: ${payload}`;
        break;
      case 'bannerAndPageContent':
        message = `banner image and page content add error: ${error}, payload: ${payload}`;
        break;
      case 'bannerAndPageContentDetails':
        message = `banner image and page content details error: ${error}, payload: ${payload}`;
        break;
      case 'footerBlock':
        message = `footer block add error: ${error}, payload: ${payload}`;
        break;
      case 'footerBlockDetails':
        message = `footer block details error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `static content, banner image and page content error ${error}`;
        break;
    }
    logger.dailyLogger('staticContentError').error(new Error(message));
  },
};
