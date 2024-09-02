import HttpStatus from 'http-status';
import { Op } from 'sequelize';
import repositories from '../repositories';
import utility from '../services/utility';

const {
  boatTypeRepository,
  boatMakeRepository,
  boatYearRepository,
  boatFeatureRepository,
  boatRuleRepository,
  boatModelRepository,
} = repositories;

export default {
  /**
   * Check duplicate boat type Exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async duplicateBoatTypeExists(req, res, next) {
    try {
      const where = {};
      const { name } = req.body;
      if (req.params.id) {
        where.name = name;
        where.id = { [Op.ne]: req.params.id };
      } else {
        where.name = name;
      }
      const result = await boatTypeRepository.getBoatTypeDetails(where);
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_TYPE_NAME_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat type exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatTypeExists(req, res, next) {
    try {
      const { id } = req.params;
      const result = await boatTypeRepository.getBoatTypeDetails({ id });
      if (result) {
        req.boatTypeInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_TYPE_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check duplicate boat Make Exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async duplicateBoatMakeExists(req, res, next) {
    try {
      const where = {};
      const { name } = req.body;
      if (req.params.id) {
        where.name = name;
        where.id = { [Op.ne]: req.params.id };
      } else {
        where.name = name;
      }
      const result = await boatMakeRepository.getBoatMakeDetails(where);
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_MAKE_NAME_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat Make exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatMakeExists(req, res, next) {
    try {
      const { id } = req.params;
      const result = await boatMakeRepository.getBoatMakeDetails({ id });
      if (result) {
        req.boatMakeInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_MAKE_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check duplicate boat Year Exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async duplicateBoatYearExists(req, res, next) {
    try {
      const where = {};
      const { year } = req.body;
      if (req.params.id) {
        where.year = year;
        where.id = { [Op.ne]: req.params.id };
      } else {
        where.year = year;
      }
      const result = await boatYearRepository.getBoatYearDetails(where);
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_YEAR_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat Year exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatYearExists(req, res, next) {
    try {
      const { id } = req.params;
      const result = await boatYearRepository.getBoatYearDetails({ id });
      if (result) {
        req.boatYearInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_YEAR_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check duplicate boat Make Exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async duplicateBoatFeatureExists(req, res, next) {
    try {
      const where = {};
      const { name } = req.body;
      if (req.params.id) {
        where.name = name;
        where.id = { [Op.ne]: req.params.id };
      } else {
        where.name = name;
      }
      const result = await boatFeatureRepository.findOneBoatFeature(where);
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_FEATURE_NAME_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat Feature exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatFeatureExists(req, res, next) {
    try {
      const { id } = req.params;
      const result = await boatFeatureRepository.findOneBoatFeature({ id });
      if (result) {
        req.boatFeatureInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_FEATURE_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check duplicate boat Rule Exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async duplicateBoatRuleExists(req, res, next) {
    try {
      const where = {};
      const { name } = req.body;
      if (req.params.id) {
        where.name = name;
        where.id = { [Op.ne]: req.params.id };
      } else {
        where.name = name;
      }
      const result = await boatRuleRepository.getBoatRuleDetails(where);
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_RULE_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat Rule exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatRuleExists(req, res, next) {
    try {
      const { id } = req.params;
      const result = await boatRuleRepository.getBoatRuleDetails({ id });
      if (result) {
        req.boatRuleInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_RULE_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat Rule exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatModelExists(req, res, next) {
    try {
      const { id } = req.params;
      const result = await boatModelRepository.findOneBoatModel({ id });
      if (result) {
        req.boatModelInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_MODEL_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
