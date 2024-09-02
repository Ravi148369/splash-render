import utility from '../services/utility';
import logger from '../services/logger';

export default {
  bookingMessageErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'bookingRequestAdd':
        message = `Booking Request add error: ${error}, payload: ${payload}`;
        break;
      case 'bookingRequestMessageAdd':
        message = `Booking Request Message add error: ${error}, payload: ${payload}`;
        break;
      case 'bookingRequestList':
        message = `Booking Request list error: ${error}`;
        break;
      case 'bookingRequestDetails':
        message = `Booking Request Message Details error: ${error}`;
        break;
      case 'bookingRequestMessageList':
        message = `Booking Request Message list error: ${error}`;
        break;
      case 'bookingRequestUpdate':
        message = `Booking Request update error: ${error}`;
        break;
      case 'bankAccount':
        message = `Add bank account error: ${error}, payload: ${payload}`;
        break;
      case 'bankAccountList':
        message = `Bank account error: ${error}`;
        break;
      case 'transactionList':
        message = `Transaction list error: ${error}`;
        break;
      default:
        message = `Booking Request Message error ${error}`;
        break;
    }
    logger.dailyLogger('bookingMessageError').error(new Error(message));
  },

  bookingMessage(type, object) {
    const { data, bodyData } = object;
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'bookingTime':
        message = `requested time according timezone, bookingTime: ${payload}`;
        break;
      default:
        message = `booking Time: ${payload}`;
        break;
    }
    logger.dailyLogger('bookingTime').info(message);
  },
};
