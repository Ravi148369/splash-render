import utility from '../services/utility';
import logger from '../services/logger';

export default {
  boatRuleErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'boatRuleAdd':
        message = `boat rule add error: ${error}, payload: ${payload}`;
        break;
      case 'boatRuleList':
        message = `boat rule list error: ${error}, payload: ${payload}`;
        break;
      case 'boatRuleDetails':
        message = `boat rule details error: ${error}, payload: ${payload}`;
        break;
      case 'boatRuleUpdate':
        message = `boat rule Update error: ${error}, payload: ${payload}`;
        break;
      case 'boatRuleUpdateStatus':
        message = `boat rule Update status error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `boat rule error ${error}`;
        break;
    }
    logger.dailyLogger('boatRuleError').error(new Error(message));
  },
};
