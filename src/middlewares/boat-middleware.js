import HttpStatus from 'http-status';
import { Op } from 'sequelize';
import repositories from '../repositories';
import utility from '../services/utility';
import models from '../models';

const { boatRepository } = repositories;
const { boatFeature } = models;

export default {
  /**
   * Check boat name Exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatNameExists(req, res, next) {
    try {
      const { name, boatId } = req.body;
      const where = {};
      if (boatId) {
        where.name = name;
        where.id = { [Op.ne]: boatId };
      } else {
        where.name = name;
      }
      const result = await boatRepository.findOne(where);
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_NAME_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat  exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatExists(req, res, next) {
    try {
      const {
        body: { boatId },
        params: { id },
      } = req;
      const finalBoatId = boatId || id;
      const result = await boatRepository.findOne({ id: finalBoatId });
      if (result) {
        req.boatInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat Blocked or not
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatBlocked(req, res, next) {
    try {
      const {
        body: { boatId, bookingDate },
        params: { id },
      } = req;
      const finalBoatId = boatId || id;
      const result = await boatRepository.getBoatBlockedDateStatus(finalBoatId, bookingDate);
      if (!result) {
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_BLOCKED'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat booked slot
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBookedSlot(req, res, next) {
    try {
      const {
        body: {
          boatId, bookingDate, startTime, endTime,
        },
        params: { id },
      } = req;
      const data = {
        boatId,
        bookingDate,
        startTime,
        endTime,
      };
      const bookingId = id || '';
      const result = await boatRepository.checkBookedSlot(data, bookingId);
      if (!result) {
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_ALREADY_BOOKED'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * check Valid Feature Ids
   * @param {Object} req
   */
  async checkValidFeatureIds(req, res, next) {
    try {
      const {
        body: { boatFeatureIds },
      } = req;
      let check = 0;
      const result = await Promise.all(
        // eslint-disable-next-line consistent-return
        boatFeatureIds.map(async (element) => {
          const resBoat = await boatFeature.findOne({
            where: { id: element },
            attributes: ['id'],
          });
          if (resBoat !== null) {
            return resBoat;
          }
          check = 1;
        }),
      );
      if (result && check === 0) {
        req.boatFeature = result;
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
   * Check boat status
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatStatus(req, res, next) {
    try {
      const {
        body: { boatId, status },
        params: { id },
      } = req;
      const finalBoatId = boatId || id;
      const result = await boatRepository.findOne({ id: finalBoatId });
      if (result) {
        if (result.status === 'pending' && status === 'listed') {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'BOAT_STATUS_VALIDATION'),
          });
        } else {
          next();
        }
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check boat Owner
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBoatOwner(req, res, next) {
    try {
      const {
        body: { boatId },
        params: { id },
        user,
      } = req;
      const finalBoatId = boatId || id;
      const result = await boatRepository.findOne({
        id: finalBoatId,
        ownerId: user.id,
      });
      if (result) {
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_NOT_BELONGS_TO_YOU'),
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Verify boat status
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async verifyBoatStatusPending(req, res, next) {
    try {
      const {
        boatInfo,
      } = req;
      if (boatInfo) {
        if (boatInfo?.status === 'pending' && boatInfo?.liveStatus === 'unlisted') {
          next();
        } else {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: utility.getMessage(req, false, 'BOAT_STATUS_VERIFY'),
          });
        }
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BOAT_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
