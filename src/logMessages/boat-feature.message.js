import utility from '../services/utility';
import logger from '../services/logger';

export default {
  boatFeatureErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'boatFeatureAdd':
        message = `boat feature add error: ${error}, payload: ${payload}`;
        break;
      case 'boatFeatureList':
        message = `boat feature list error: ${error}, payload: ${payload}`;
        break;
      case 'boatFeatureDetails':
        message = `boat feature details error: ${error}, payload: ${payload}`;
        break;
      case 'boatFeatureUpdate':
        message = `boat feature Update error: ${error}, payload: ${payload}`;
        break;
      case 'boatFeatureUpdateStatus':
        message = `boat feature Update status error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `boat feature error ${error}`;
        break;
    }
    logger.dailyLogger('boatFeatureError').error(new Error(message));
  },
};
