import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';
import models from '../models';

const { userDocument } = models;
const { userRepository, boatRepository } = repositories;

export default {
  /**
   * Check user exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkUserExists(req, res, next) {
    try {
      if (req.params.userId) {
        const { userId } = req.params;
        const result = await userRepository.findOne({ id: userId });
        if (result) {
          req.userInfo = result;
          next();
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'USER_NOT_FOUND'),
          });
        }
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check user exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkUserIdExists(req, res, next) {
    try {
      if (req.body.userId) {
        const { userId } = req.body;
        const result = await userRepository.findOne({ id: userId });
        if (result) {
          next();
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'USER_NOT_FOUND'),
          });
        }
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check email exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkEmailExists(req, res, next) {
    try {
      const userData = req.user;
      const { email } = req.body;
      const findUserData = await userRepository.findOne({ email });
      if (userData) {
        if (findUserData && findUserData.id !== userData.id) {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'EMAIL_EXIST'),
          });
        } else {
          next();
        }
      } else if (findUserData) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'EMAIL_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check email exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkPhoneNumberExists(req, res, next) {
    try {
      const userData = req.user;
      const { phoneNumber } = req.body;
      const findUserData = await userRepository.findOne({ phoneNumber });
      if (userData) {
        if (findUserData && findUserData.id !== userData.id) {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'PHONE_EXIST'),
          });
        } else {
          next();
        }
      } else if (findUserData) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'PHONE_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify user owner exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async VerifyUserOwnerExist(req, res, next) {
    try {
      const { params: { id } } = req;
      const result = await boatRepository.findOne({ ownerId: id, status: 'completed' });
      if (result) {
        req.boatInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'REPORT_USER_NOT_OWNER'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check user document exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkUserDocumentExists(req, res, next) {
    try {
      const { params: { id } } = req;
      const result = await userDocument.findOne({ where: { id, userId: req?.user?.id } });
      if (result) {
        req.userDocumentInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'USER_DOCUMENT_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
