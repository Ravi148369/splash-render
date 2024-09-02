import utility from '../services/utility';
import logger from '../services/logger';

export default {
  userErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'userList':
        message = `user list error: ${error}, payload: ${payload}`;
        break;
      case 'userDetails':
        message = `user details error: ${error}, payload: ${payload}`;
        break;
      case 'userUpdate':
        message = `user Update error: ${error}, payload: ${payload}`;
        break;
      case 'userUpdateStatus':
        message = `user Update status error: ${error}, payload: ${payload}`;
        break;
      case 'createPassword':
        message = `user create password error: ${error}, payload: ${payload}`;
        break;
      case 'updatePassword':
        message = `user update password error: ${error}, payload: ${payload}`;
        break;
      case 'changePassword':
        message = `user change password error: ${error}, payload: ${payload}`;
        break;
      case 'signup':
        message = `user sign up error: ${error}, payload: ${payload}`;
        break;
      case 'count':
        message = `user count error: ${error}, payload: ${payload}`;
        break;
      case 'verifyOtp':
        message = `user otp verify error: ${error}, payload: ${payload}`;
        break;
      case 'resendOtp':
        message = `user otp resend error: ${error}, payload: ${payload}`;
        break;
      case 'emailExist':
        message = `user email exist error: ${error}, payload: ${payload}`;
        break;
      case 'notificationCount':
        message = `user notification count error: ${error}, payload: ${payload}`;
        break;
      case 'dashboardDetails':
        message = `Admin dashboard detail error: ${error}`;
        break;
      default:
        message = `user error ${error}`;
        break;
    }
    logger.dailyLogger('userError').error(new Error(message));
  },
};
