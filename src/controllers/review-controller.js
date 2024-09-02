import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { reviewRepository } = repositories;

export default {
  /**
   * Add Admin Review in admin settings
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addAdminReview(req, res, next) {
    try {
      const result = await reviewRepository.addAdminReview(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'ADMIN_REVIEW_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add User Review in admin settings
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addUserReview(req, res, next) {
    try {
      const result = await reviewRepository.addUserReview(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'USER_REVIEW_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Admin Review list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getAdminReviews(req, res, next) {
    try {
      const result = await reviewRepository.getAdminReviews(req);
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
   * Get User and Boat Review list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getUserAndBoatReviews(req, res, next) {
    try {
      const result = await reviewRepository.getUserAndBoatReviews(req);
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
   * get Admin Review Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getAdminReviewDetail(req, res, next) {
    try {
      const result = req.adminReviewInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'ADMIN_REVIEW_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Admin Review Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateAdminReview(req, res, next) {
    try {
      const result = await reviewRepository.updateAdminReview(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'ADMIN_REVIEW_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Admin Review Status
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateAdminReviewStatus(req, res, next) {
    try {
      const result = await reviewRepository.updateAdminReviewStatus(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'ADMIN_REVIEW_UPDATED_STATUS'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete Admin Review
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async deleteAdminReview(req, res, next) {
    try {
      const bodyData = {
        id: req.params.id,
      };
      await reviewRepository.deleteAdminReview(bodyData);
      res.status(HttpStatus.OK).json({
        success: true,
        data: [],
        message: utility.getMessage(req, false, 'ADMIN_REVIEW_DELETED'),
      });
    } catch (error) {
      next(error);
    }
  },
};
