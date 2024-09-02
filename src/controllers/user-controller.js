import HttpStatus from 'http-status';
import repositories from '../repositories';
import models from '../models';
import utility from '../services/utility';
import config from '../config';

const { userToken } = models;
const { userRepository } = repositories;

export default {
  /**
   * Get all user list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getUserListForAdmin(req, res, next) {
    try {
      const result = await userRepository.getUserList(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: '',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * update Profile
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async updateProfile(req, res, next) {
    try {
      const result = await userRepository.updateProfile(req);
      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: result,
          message: utility.getMessage(req, false, 'PROFILE_UPDATED'),
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
   * Change user status
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async changeStatus(req, res, next) {
    try {
      const userObject = req.userInfo;
      const bodyData = req.body;
      await userRepository.updateUser(userObject, bodyData);
      if (bodyData.status !== 'active') {
        await userToken.destroy({
          where: { userId: req.params.userId },
        });
      }
      res.status(HttpStatus.OK).json({
        success: true,
        data: [],
        message: utility.getMessage(req, false, 'USER_STATUS_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get payment setting
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getPaymentSetting(req, res, next) {
    try {
      const paymentSetting = {
        stripe_publishable_key: config.stripe.publishableKey,
      };
      res.status(HttpStatus.OK).json({
        success: true,
        data: paymentSetting,
        message: '',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Profile completion percentage
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getProfileCompletion(req, res, next) {
    try {
      const result = await userRepository.getProfileCompletion(req);
      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: result,
          message: utility.getMessage(req, false, ''),
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
   * Get owner detail
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getOwnerDetail(req, res, next) {
    try {
      const result = await userRepository.getOwnerDetail(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: '',
      });
    } catch (error) {
      next(error);
    }
  },

};
