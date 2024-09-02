import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { aboutUsPageSettingRepository } = repositories;

export default {
  /**
   * Add and Update About us page settings in site settings
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async addAboutUsPageSetting(req, res, next) {
    try {
      const result = await aboutUsPageSettingRepository.addAboutUsPageSetting(
        req,
      );
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(
          req,
          false,
          'ABOUT_US_PAGE_SETTING_UPDATED',
        ),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get About us page settings list and filter by type
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getAboutUsPageSetting(req, res, next) {
    try {
      const result = await aboutUsPageSettingRepository.getAboutUsPageSetting(
        req,
      );
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
