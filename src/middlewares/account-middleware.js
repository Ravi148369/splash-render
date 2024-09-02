import HttpStatus from 'http-status';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import { OAuth2Client } from 'google-auth-library';
import mediaMiddleware from './media-middleware';
import utility from '../services/utility';
import repository from '../repositories';
import jwt from '../services/jwt';
import models from '../models';

const { userVerification } = models;
const { userRepository, accountRepository } = repository;
export default {
  /**
   * Check email exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkEmailExists(req, res, next) {
    try {
      const { body: { email } } = req;
      if (email) {
        const userObject = await userRepository.findOne({ email });
        if (userObject) {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: null,
            message: utility.getMessage(req, false, 'EMAIL_EXIST'),
          });
        } else {
          next();
        }
      } else {
        throw utility.customError(req, 'EMAIL_REQUIRED', 1);
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check user media for
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkUserMediaFor(req, res, next) {
    const { params } = req;
    const basePathStr = params.basePath;
    const newImages = [];
    if (basePathStr && basePathStr !== req.user.profileImage) {
      newImages.push(basePathStr);
    }
    params.basePath = '';
    params.basePathArray = newImages;
    return (
      (params.basePathArray.length > 0
        && mediaMiddleware.checkMediaFor(req, res, next))
      || next()
    );
  },

  /**
   * Check user media exist
   * Note:- this middleware after checkUserMediaExists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkUserMediaExists(req, res, next) {
    const { params } = req;
    return (
      (params.basePathArray.length > 0
        && mediaMiddleware.checkMediaExists(req, res, next))
      || next()
    );
  },

  /**
   * Check social media auth token exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkSocialAuthToken(req, res, next) {
    try {
      if (req.body.type === 'google') {
        // Google Social Login
        const googleIdToken = req.body.socialToken;
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const client = new OAuth2Client(clientId);
        const ticket = await client.verifyIdToken({
          idToken: googleIdToken,
          audience: clientId,
        });
        const googleResult = ticket.getPayload();
        req.body.socialId = googleResult.sub;
        req.body.email = googleResult.email;
        req.body.firstName = googleResult.given_name;
        req.body.lastName = googleResult.family_name;
        if (googleResult) {
          req.googleResult = googleResult;
          next();
        }
      } else if (req.body.type === 'facebook') {
        // Facebook Social Login
        if (!req.body.socialId || !req.body.email || !req.body.firstName || !req.body.lastName) {
          const error = new Error(utility.getMessage(req, false, 'INVALID_USER_SOCIAL_CREDENTIAL'));
          error.status = HttpStatus.BAD_REQUEST;
          next(error);
        }
        const facebookIdToken = req.body.socialToken;
        const facebookResult = await axios.get('https://graph.facebook.com/me', { params: { access_token: facebookIdToken } });
        if (facebookResult) {
          req.facebookResult = facebookResult;
          next();
        } else {
          const error = new Error(utility.getMessage(req, false, 'INVALID_ACCESS'));
          error.status = HttpStatus.BAD_REQUEST;
          next(error);
        }
      }
    } catch (error) {
      error.message = utility.getMessage(req, false, 'INVALID_ACCESS');
      next(error);
    }
  },

  /**
   * Check social Id exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkSocialIdExist(req, res, next) {
    try {
      const {
        body: {
          socialId, type, email, deviceType, deviceId, firebaseToken,
        },
      } = req;
      const where = { email };
      const updateData = {};
      const user = await userRepository.findOne(where);
      if (user) {
        if (user?.status !== 'inactive') {
          if (socialId) {
            updateData.socialId = socialId;
          }
          if (type) {
            updateData.type = type;
          }
          const userResult = user;
          await userResult.update(updateData);
          const { ...userData } = user.get();
          const token = jwt.createToken(userData);
          const deviceData = {
            userId: userData.id,
            token,
            deviceId,
            deviceType,
            firebaseToken,
            userResult,
          };
          await accountRepository.addUpdateUserDevice(deviceData);
          const userVerificationData = await userVerification.findOne(
            { where: { userId: user?.id } },
          );
          if (type === 'google') {
            if (userVerificationData && userVerificationData?.isGoogleVerified === 0) {
              await userVerification.update(
                { isGoogleVerified: 1 },
                { where: { userId: user?.id } },
              );
            }
            if (!userVerificationData && userVerificationData?.isGoogleVerified !== 0) {
              await userVerification.create({ userId: user?.id, isGoogleVerified: 1 });
            }
          }
          if (type === 'facebook') {
            if (userVerificationData && userVerificationData?.isFacebookVerified === 0) {
              await userVerification.update(
                { isFacebookVerified: 1 },
                { where: { userId: user?.id } },
              );
            }
            if (!userVerificationData && userVerificationData?.isFacebookVerified !== 0) {
              await userVerification.create({ userId: user?.id, isFacebookVerified: 1 });
            }
          }
          res.status(HttpStatus.OK).json({
            success: true,
            data: { token, ...userData },
            message: utility.getMessage(req, false, 'LOGIN_SUCCESS'),
          });
        } else {
          const error = new Error(utility.getMessage(req, false, 'ACCOUNT_INACTIVE'));
          error.status = HttpStatus.BAD_REQUEST;
          next(error);
        }
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },
};
