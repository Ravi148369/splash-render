import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { siteSettingRepository } = repositories;

export default {
  /**
   * Add and Update site settings
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async addSiteSetting(req, res, next) {
    try {
      const result = await siteSettingRepository.addSiteSetting(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'SITE_SETTING_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get site settings details
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getSiteSetting(req, res, next) {
    try {
      const result = await siteSettingRepository.getSiteSetting(req);
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
