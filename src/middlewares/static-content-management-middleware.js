import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { staticContentManagementRepository } = repositories;

export default {
  /**
   * Check page exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkPageExists(req, res, next) {
    try {
      const { id } = req.params;
      const result = await staticContentManagementRepository.getStaticPageDetails({
        id,
      });
      if (result) {
        req.pageInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'CMS_PAGE_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
