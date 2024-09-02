import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { countryRepository } = repositories;

export default {
  /**
   * Get all Country list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getAllCountry(req, res, next) {
    try {
      const result = await countryRepository.getAllCountry(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'COUNTRY_LIST'),
      });
    } catch (error) {
      next(error);
    }
  },
};
