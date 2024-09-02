import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { ownerPageSettingRepository } = repositories;

export default {
  /**
   * Add and Update Owner page settings in site settings
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async addOwnerPageSetting(req, res, next) {
    try {
      const result = await ownerPageSettingRepository.addOwnerPageSetting(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'OWNER_PAGE_SETTING_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Owner page settings list and filter by type
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getOwnerPageSetting(req, res, next) {
    try {
      const result = await ownerPageSettingRepository.getOwnerPageSetting(req);
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
