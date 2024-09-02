import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { languageRepository } = repositories;

export default {
  /**
   * Get all Language list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getAllLanguageList(req, res, next) {
    try {
      const result = await languageRepository.getAllLanguageList();
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'LANGUAGE_LIST'),
      });
    } catch (error) {
      next(error);
    }
  },
};
