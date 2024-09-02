import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { bankAccountRepository } = repositories;

export default {
  /**
   * Add bank account to receive payouts
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBankAccount(req, res, next) {
    try {
      const result = await bankAccountRepository.addBankAccount(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BANK_ACCOUNT_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get owner bank account
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBankAccount(req, res, next) {
    try {
      const result = await bankAccountRepository.getBankAccount(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BANK_ACCOUNT_LIST'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get transaction list for owner
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async transactionList(req, res, next) {
    try {
      const result = await bankAccountRepository.transactionList(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'TRANSACTION_LIST'),
      });
    } catch (error) {
      next(error);
    }
  },
};
