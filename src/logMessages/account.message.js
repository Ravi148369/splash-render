import utility from '../services/utility';
import logger from '../services/logger';

export default {
  accountErrorMessage(type, object) {
    const { data, bodyData } = object;
    const error = utility.jsonToString(object?.error);
    const payload = utility.jsonToString(data ?? bodyData);
    let message = '';
    switch (type) {
      case 'accountLogin':
        message = `account login error: ${error}, payload: ${payload}`;
        break;
      case 'accountSignup':
        message = `account signup error: ${error}, payload: ${payload}`;
        break;
      case 'userDevice':
        message = `account user device error: ${error}, payload: ${payload}`;
        break;
      case 'comparePassword':
        message = `account compare password error: ${error}, payload: ${payload}`;
        break;
      case 'userDeviceToken':
        message = `account user device token error: ${error}, payload: ${payload}`;
        break;
      case 'forgotPassword':
        message = `account forgot password error: ${error}, payload: ${payload}`;
        break;
      case 'resetPassword':
        message = `account reset password error: ${error}, payload: ${payload}`;
        break;
      case 'resetPasswordToken':
        message = `account reset password token error: ${error}, payload: ${payload}`;
        break;
      case 'userDeviceHistory':
        message = `account user device history error: ${error}, payload: ${payload}`;
        break;
      case 'updateProfileImage':
        message = `account update profile image error: ${error}, payload: ${payload}`;
        break;
      case 'accountVerification':
        message = `Account verification error: ${error}, payload: ${payload}`;
        break;
      case 'accountVerificationDetails':
        message = `Account verification details error: ${error}`;
        break;
      case 'otpSend':
        message = `Account verification otp send error: ${error}, payload: ${payload}`;
        break;
      case 'otpVerify':
        message = `Account verification otp verify error: ${error}`;
        break;
      default:
        message = `account error ${error}`;
        break;
    }
    logger.dailyLogger('accountError').error(new Error(message));
  },
};
