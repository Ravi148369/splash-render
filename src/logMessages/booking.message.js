import utility from '../services/utility';
import logger from '../services/logger';

export default {
  bookingErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'bookingAdd':
        message = `Booking add error: ${error}, payload: ${payload}`;
        break;
      case 'bookingCreatePayment':
        message = `Booking create payment intent error: ${error}, payload: ${payload}`;
        break;
      case 'paymentRetrieve':
        message = `Booking payment retrieve error: ${error}, payload: ${payload}`;
        break;
      case 'eventBookingList':
        message = `User's Event Booking list error: ${error}`;
        break;
      case 'bookingList':
        message = `User's Boat Booking list error: ${error}`;
        break;
      case 'reservationsList':
        message = `User's Boat Reservations list error: ${error}`;
        break;
      case 'boatBookingDetails':
        message = `Boat Booking Details error: ${error}`;
        break;
      case 'eventBookingDetails':
        message = `Event Booking Details error: ${error}`;
        break;
      case 'bookingCancellation':
        message = `Boat Booking Cancellation error: ${error}, payload: ${payload}`;
        break;
      case 'eventBookingCancellation':
        message = `Event Booking Cancellation error: ${error}, payload: ${payload}`;
        break;
      case 'bookingRefund':
        message = `Cancellation refund error: ${error}`;
        break;
      case 'calculateRefund':
        message = `Refund amount calculate error: ${error}`;
        break;
      case 'calculateTransferAmount':
        message = `Transfer amount calculate error: ${error}`;
        break;
      case 'bookingTransfer':
        message = `Transfer to owner account error: ${error}`;
        break;
      case 'eventBookingRefund':
        message = `Cancellation refund error: ${error}`;
        break;
      case 'calculateBookingRefundAmount':
        message = `Calculate booking refund amount error: ${error}`;
        break;
      case 'calculateEventBookingRefundAmount':
        message = `Calculate booking refund amount error: ${error}`;
        break;
      default:
        message = `Booking error ${error}`;
        break;
    }
    logger.dailyLogger('bookingError').error(new Error(message));
  },
};
