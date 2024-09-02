import HttpStatus from 'http-status';
import repositories from '../../repositories';
import utility from '../../services/utility';

const { boatRuleRepository } = repositories;

export default {
  /**
   * Add boat Rule in boat settings
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBoatRule(req, res, next) {
    try {
      const result = await boatRuleRepository.addBoatRule(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_RULE_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all boat Rule list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBoatRules(req, res, next) {
    try {
      const result = await boatRuleRepository.getBoatRules(req);
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
   * get Boat Rule Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getBoatRuleDetail(req, res, next) {
    try {
      const result = req.boatRuleInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_RULE_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Boat Rule Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateBoatRule(req, res, next) {
    try {
      const result = await boatRuleRepository.updateBoatRule(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BOAT_RULE_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },
};
