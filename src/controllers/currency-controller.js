import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { currencyRepository } = repositories;

export default {
  /**
   * Get all currency list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getAllCurrencyList(req, res, next) {
    try {
      const result = await currencyRepository.getAllCurrencyList();
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'CURRENCY_LIST'),
      });
    } catch (error) {
      next(error);
    }
  },
};
