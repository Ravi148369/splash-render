import utility from '../services/utility';
import logger from '../services/logger';

export default {
  eventErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'eventAdd':
        message = `Event add error: ${error}, payload: ${payload}`;
        break;
      case 'eventList':
        message = `Event list error: ${error}, payload: ${payload}`;
        break;
      case 'eventDetails':
        message = `Event details error: ${error}, payload: ${payload}`;
        break;
      case 'eventUpdate':
        message = `Event Update error: ${error}, payload: ${payload}`;
        break;
      case 'eventBookingTransaction':
        message = `Booked event Transaction error: ${error}, payload: ${payload}`;
        break;
      default:
        message = `Event error ${error}`;
        break;
    }
    logger.dailyLogger('eventError').error(new Error(message));
  },
};
