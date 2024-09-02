import utility from '../services/utility';
import logger from '../services/logger';

export default {
  boatErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'boatAdd':
        message = `Boat add error: ${error}, payload: ${payload}`;
        break;
      case 'boatImageAdd':
        message = `Boat image add error: ${error}, payload: ${payload}`;
        break;
      case 'boatList':
        message = `Boat list error: ${error}, payload: ${payload}`;
        break;
      case 'boatDetails':
        message = `Boat details error: ${error}, payload: ${payload}`;
        break;
      case 'boatDetailsAdd':
        message = `Boat add details error: ${error}, payload: ${payload}`;
        break;
      case 'updateBoat':
        message = `Boat update first step error: ${error}, payload: ${payload}`;
        break;
      case 'boatUpdateStatus':
        message = `Boat Update status error: ${error}, payload: ${payload}`;
        break;
      case 'boatBlockStatus':
        message = `Boat block status error: ${error}, payload: ${payload}`;
        break;
      case 'checkBookedSlot':
        message = `Boat booked slot error: ${error}, payload: ${payload}`;
        break;
      case 'boatBookingTransaction':
        message = `Booked boat transaction error: ${error}, payload: ${payload}`;
        break;
      case 'deleteBoat':
        message = `Boat delete error: ${error}`;
        break;
      default:
        message = `boat error ${error}`;
        break;
    }
    logger.dailyLogger('boatError').error(new Error(message));
  },
};
