import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { userRepository } = repositories;

export default {
  /**
   * Update admin profile
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async updateProfile(req, res, next) {
    try {
      const result = await userRepository.AdminUpdateProfile(req);
      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: null,
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
   * Get Users
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getUsers(req, res, next) {
    try {
      const result = await userRepository.getUserList(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'USER_LIST'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * get User Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getUserDetail(req, res, next) {
    try {
      const result = req.userInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'USER_DETAIL'),
      });
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
      const bodyData = {
        id: req.params.userId,
        status: req.body.status,
      };
      await userRepository.updateUserStatus(bodyData);
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
   * Get dashboard details
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getDashboardDetail(req, res, next) {
    try {
      const result = await userRepository.getDashboardDetail();
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'DASHBOARD_DETAILS'),
      });
    } catch (error) {
      next(error);
    }
  },
};
