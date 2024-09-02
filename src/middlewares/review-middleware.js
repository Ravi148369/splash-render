import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { reviewRepository, bookingRepository } = repositories;

export default {
  /**
   * Check Admin Review exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkAdminReviewExists(req, res, next) {
    try {
      const { id } = req.params;
      const result = await reviewRepository.getAdminReviewDetails({ id });
      if (result) {
        req.adminReviewInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'ADMIN_REVIEW_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify user for booking review
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async verifyUserForReview(req, res, next) {
    try {
      const { body: { boatId }, user: { id } } = req;
      const result = await bookingRepository.getBoatBookingDetail({ boatId, userId: id });
      if (result) {
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'INVALID_USER_REVIEW'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
