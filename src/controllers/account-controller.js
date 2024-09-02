import HttpStatus from 'http-status';
import utility from '../services/utility';
import repositories from '../repositories';
import jwt from '../services/jwt';

const { RateLimiterMemory } = require('rate-limiter-flexible');

const { accountRepository, userRepository } = repositories;

/**
 * Set rate limiter object
 */
const rateLimiterForAttempts = new RateLimiterMemory({
  points: 5, // 5 points
  duration: 60, // per 60 seconds
  blockDuration: 10 * 60, // block for 10 minutes if more than points consumed
});

const rateLimiterForAccountAttempts = new RateLimiterMemory({
  points: 5, // 5 points
  duration: 60, // per 60 seconds
  blockDuration: 10 * 60, // block for 10 minutes if more than points consumed
});

export default {
  /**
   * user login api
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async userAccountLogin(req, res, next) {
    try {
      const user = await accountRepository.checkUserAccountLogin(req);

      if (user.token) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: user,
          message: utility.getMessage(req, false, 'LOGIN_SUCCESS'),
        });
      } else if (user.status === 'inactive') {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'ACCOUNT_INACTIVE'),
        });
      } else if (user.status === 'otpResend') {
        res.status(HttpStatus.OK).json({
          success: true,
          data: {},
          message: utility.getMessage(req, false, 'OTP_SENT_EMAIL'),
        });
      } else {
        rateLimiterForAccountAttempts
          .consume(req.ip)
          .then(() => {
            res.status(HttpStatus.BAD_REQUEST).json({
              success: false,
              data: [],
              message: utility.getMessage(req, false, 'INVALID_CREDENTIAL'),
            });
          })
          .catch(() => {
            res.status(429).json({
              success: false,
              data: [],
              message: utility.getMessage(req, false, 'TO_MANY_ATTEMPTS'),
            });
          });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin login api
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async login(req, res, next) {
    try {
      const user = await accountRepository.checkLogin(req);
      if (user.token) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: user,
          message: utility.getMessage(req, false, 'LOGIN_SUCCESS'),
        });
      } else if (user.status === 'inactive') {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'ACCOUNT_INACTIVE'),
        });
      } else {
        rateLimiterForAttempts
          .consume(req.ip)
          .then(() => {
            res.status(HttpStatus.BAD_REQUEST).json({
              success: false,
              data: [],
              message: utility.getMessage(req, false, 'INVALID_CREDENTIAL'),
            });
          })
          .catch(() => {
            res.status(429).json({
              success: false,
              data: [],
              message: utility.getMessage(req, false, 'TO_MANY_ATTEMPTS'),
            });
          });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * User logout api
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async logout(req, res, next) {
    try {
      const userData = req.user;
      const userDevice = await accountRepository.getUserDeviceToken(
        userData.id,
      );
      if (userDevice) {
        const data = { token: null };
        await accountRepository.updateUserDevice(userDevice, data);
        res.status(HttpStatus.OK).json({
          success: true,
          data: null,
          message: utility.getMessage(req, false, 'LOGOUT_SUCCESS'),
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'USER_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
  /**
   * User signup api
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async userSignup(req, res, next) {
    try {
      const userSignup = await accountRepository.userSignup(req);
      if (userSignup) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: null,
          message: utility.getMessage(req, false, 'SIGNUP_SUCCESS'),
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'TRY_AGAIN'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * User change password api
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async changePassword(req, res, next) {
    try {
      const result = await userRepository.changePassword(req);
      if (result) {
        if (result.status === 'changed') {
          res.status(HttpStatus.OK).json({
            success: true,
            data: null,
            message: utility.getMessage(req, false, 'PASSWORD_CHANGED'),
          });
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: null,
            message: utility.getMessage(req, false, 'INVALID_PASSWORD'),
          });
        }
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'UNAUTHORIZED_ACCESS'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin forgot password
   * @param {oject} req
   * @param {object} res
   * @param {function} next
   */
  async adminForgotPassword(req, res, next) {
    try {
      const result = await accountRepository.adminForgotPassword(req);
      if (result) {
        if (result.status === 'inactive') {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'ACCOUNT_INACTIVE'),
          });
        }
        if (result.status === 'send_error') {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'UNABLE_MAIL_SEND'),
          });
        } else {
          res.status(HttpStatus.OK).json({
            success: true,
            data: null,
            message: utility.getMessage(req, false, 'PASSWORD_LINK_SENT'),
          });
        }
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'EMAIL_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Reset admin password
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async resetAdminPassword(req, res, next) {
    try {
      const user = await accountRepository.resetAdminPassword(req);
      if (user && user.status === 'updated') {
        res.status(HttpStatus.OK).json({
          success: true,
          data: null,
          message: utility.getMessage(req, false, 'PASSWORD_CHANGED'),
        });
      } else if (user && user.status === 'inactive') {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'ACCOUNT_INACTIVE'),
        });
      } else if (!user) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'PASSWORD_LINK_EXPIRED'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Find user by id
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getUserDetail(req, res, next) {
    try {
      const { userId } = req.params;
      const userInfo = await userRepository.getUserProfile(req);
      req.query.userId = userId;
      res.status(HttpStatus.OK).json({
        success: true,
        data: userInfo,
        message: utility.getMessage(req, false, 'USER_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Account forgot password
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  async accountForgotPassword(req, res, next) {
    try {
      const result = await accountRepository.accountForgotPassword(req);
      if (result) {
        if (result.status === 'inactive') {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'ACCOUNT_INACTIVE'),
          });
        }
        if (result.status === 'send_error') {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'UNABLE_MAIL_SEND'),
          });
        } else {
          res.status(HttpStatus.OK).json({
            success: true,
            data: null,
            message: utility.getMessage(req, false, 'PASSWORD_LINK_SENT'),
          });
        }
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'EMAIL_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
  /**
   * update Profile Image
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async updateProfileImage(req, res, next) {
    try {
      const result = await accountRepository.updateProfileImage(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'PROFILE_IMAGE_UPLOADED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * User social singUp api
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async userSocialSignup(req, res, next) {
    try {
      const userSignup = await accountRepository.userSocialSignup(req);
      if (userSignup) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: req?.userInfo ?? {},
          message: utility.getMessage(req, false, 'SIGNUP_SUCCESS'),
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'TRY_AGAIN'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * User account verify
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async userAccountVerify(req, res, next) {
    try {
      const userVerification = await accountRepository.userAccountVerify(req);
      if (userVerification) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: req?.userInfo ?? {},
          message: utility.getMessage(req, false, 'USER_VERIFICATION'),
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'TRY_AGAIN'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user verification
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  async getUserVerification(req, res, next) {
    try {
      const data = await accountRepository.getUserVerification(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data,
        message: utility.getMessage(req, false, 'USER_VERIFICATION_DETAILS'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Account verification otp send
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  async verificationOtpSend(req, res, next) {
    try {
      const result = await accountRepository.verificationOtpSend(req);
      if (result) {
        if (result.status === 'inactive') {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'ACCOUNT_INACTIVE'),
          });
        }
        if (result.status === 'send_error') {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'UNABLE_MAIL_SEND'),
          });
        } else {
          res.status(HttpStatus.OK).json({
            success: true,
            data: null,
            message: utility.getMessage(req, false, 'OTP_SENT_EMAIL'),
          });
        }
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'EMAIL_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Account verification signup resend otp
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  async signupResendOtp(req, res, next) {
    try {
      const { body: { email } } = req;
      const userResult = await userRepository.findOne({ email });
      req.user = userResult;
      const result = await accountRepository.verificationOtpSend(req);
      if (result) {
        if (result.status === 'inactive') {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'ACCOUNT_INACTIVE'),
          });
        }
        if (result.status === 'send_error') {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'UNABLE_MAIL_SEND'),
          });
        } else {
          res.status(HttpStatus.OK).json({
            success: true,
            data: null,
            message: utility.getMessage(req, false, 'OTP_SENT_EMAIL'),
          });
        }
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: null,
          message: utility.getMessage(req, false, 'EMAIL_NOT_EXIST'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user verification otp verify
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  async verificationOtpVerify(req, res, next) {
    try {
      const data = await accountRepository.verificationOtpVerify(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: data ?? {},
        message: utility.getMessage(req, false, 'USER_VERIFICATION_OTP'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user verification otp verify
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  async signupOtpVerify(req, res, next) {
    try {
      const { body: { email } } = req;
      const userResult = await userRepository.findOne({ email });
      req.user = userResult;
      await accountRepository.verificationOtpVerify(req);
      const { ...userData } = userResult.get();
      const token = jwt.createToken(userData);
      const deviceData = {
        userId: userData.id,
        token,
        deviceId: '',
        deviceType: 'Web',
        firebaseToken: null,
        userResult,
      };
      await accountRepository.addUpdateUserDevice(deviceData);
      res.status(HttpStatus.OK).json({
        success: true,
        data: { token, ...userData } ?? {},
        message: utility.getMessage(req, false, 'USER_VERIFICATION_OTP'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Winston Logs Path
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  async getWinstonLogsPath(req, res, next) {
    try {
      const data = await accountRepository.getWinstonLogsPath(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Winston Logs List
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  async getWinstonLogs(req, res, next) {
    try {
      const queryData = req.query;
      const data = await accountRepository.getWinstonLogs(queryData);
      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
 * Get Winston Logs level count
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
  async getWinstonLogsLevelCount(req, res, next) {
    try {
      const queryData = req.query;
      const data = await accountRepository.getWinstonLevelCount(queryData);
      res.status(HttpStatus.OK).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
