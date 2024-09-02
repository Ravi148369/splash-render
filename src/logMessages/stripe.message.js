import utility from '../services/utility';
import logger from '../services/logger';

export default {
  paymentMessage(type, object) {
    const {
      result,
      data,
      token,
      id,
      stripeCustomerId,
      stripeConnectedAccountId,
      bodyData,
      bankId,
    } = object;
    const response = utility.jsonToString(result ?? token);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'customer':
        message = `Stripe customer create: response: ${response}, payload: ${payload}`;
        break;
      case 'intent':
        message = `Stripe payment intents: response: ${response}, payload: ${payload}`;
        break;
      case 'addBank':
        message = `Stripe add bank: response: ${response}, bankId: ${bankId}, stripeCustomerId: ${stripeCustomerId}`;
        break;
      case 'storeAccountCreate':
        message = `Stripe store account create: response: ${response}, id: ${id}, stripeCustomerId: ${stripeCustomerId}`;
        break;
      case 'retrieveBank':
        message = `Stripe Retrieve payment response: ${response}, payload: ${payload}`;
        break;
      case 'connectedAccount':
        message = `Stripe connected account response: ${response}, stripeConnectedAccountId: ${stripeConnectedAccountId}`;
        break;
      case 'retrievePayment':
        message = `Stripe Retrieve payment: ${response}, payload: ${payload}`;
        break;
      case 'refundAmount':
        message = `Stripe refund amount response: ${response}, payload: ${payload}`;
        break;
      case 'createTransfers':
        message = `Stripe create transfers response: ${response}, payload: ${payload}`;
        break;
      default:
        message = `Stripe response: ${response}`;
        break;
    }
    logger.dailyLogger('paymentInfo').info(message);
  },

  paymentErrorMessage(type, object) {
    const {
      data,
      stripeCustomerId,
      bodyData,
      bankId,
    } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'customer':
        message = `Stripe customer create error: ${error}, payload: ${payload}`;
        break;
      case 'intent':
        message = `Stripe payment intents error: ${error}, payload: ${payload}`;
        break;
      case 'addBank':
        message = `Stripe add bank error: ${error}, bankId: ${bankId}, stripeCustomerId: ${stripeCustomerId}`;
        break;
      case 'customerRetrieve':
        message = `Stripe retrieve get error: ${error}`;
        break;
      case 'storeAccountCreate':
        message = `Stripe store account error: ${error}, payload: ${payload}`;
        break;
      case 'retrievePayment':
        message = `Stripe Retrieve payment error: ${error}, payload: ${payload}`;
        break;
      case 'refundAmount':
        message = `Stripe refund amount error: ${error}, payload: ${payload}`;
        break;
      case 'createTransfers':
        message = `Stripe create transfers error: ${error}, payload: ${payload}`;
        break;
      case 'connectedAccount':
        message = `Stripe connected account error: ${error}, payload: ${payload}`;
        break;
      case 'listBankAccount':
        message = `Stripe bank account list error: ${error}`;
        break;
      case 'deleteBankAccount':
        message = `Stripe delete bank account error: ${error}`;
        break;
      default:
        message = `Stripe error ${error}`;
        break;
    }
    logger.dailyLogger('paymentError').error(new Error(message));
  },
};
