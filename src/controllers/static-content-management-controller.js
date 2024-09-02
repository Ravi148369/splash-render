import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { staticContentManagementRepository } = repositories;

export default {
  /**
   * Get all static Content page list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getStaticContentPages(req, res, next) {
    try {
      const result = await staticContentManagementRepository.getStaticContentPages(req);
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
   * get Static Content Pages Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getStaticContentPagesDetail(req, res, next) {
    try {
      const result = req.pageInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'CMS_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Static Content Pages Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateStaticContentPage(req, res, next) {
    try {
      const result = await staticContentManagementRepository.updateStaticContentPages(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'CMS_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add & Update Banner Image and home page Content
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async addAndUpdateBannerImageAndPageContent(req, res, next) {
    try {
      const result = await staticContentManagementRepository.addBannerImageAndPageContent(
        req,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BANNER_AND_PAGE_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Banner Image and home page Content Details
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBannerImageAndPageContent(req, res, next) {
    try {
      const result = await staticContentManagementRepository.getBannerImageAndPageContent(
        req,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BANNER_AND_PAGE_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add & Update Footer block content
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async addAndUpdateFooterBlockDetails(req, res, next) {
    try {
      const result = await staticContentManagementRepository.addFooterBlockContent(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'FOOTER_BLOCK_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Footer block content Details
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getFooterBlockDetails(req, res, next) {
    try {
      const result = await staticContentManagementRepository.getFooterBlockContent(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'FOOTER_BLOCK_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },
};
