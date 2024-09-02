import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { boatRepository } = repositories;

export default {
  /**
   * addBoat
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBoat(req, res, next) {
    try {
      const result = await boatRepository.createBoat(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update boat Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateBoat(req, res, next) {
    try {
      const result = await boatRepository.updateBoat(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BOAT_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * add Boat Images
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBoatImages(req, res, next) {
    try {
      const result = await boatRepository.addBoatImages(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_IMAGE_ADDED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * add Boat Detail
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBoatDetail(req, res, next) {
    try {
      const result = await boatRepository.addBoatDetail(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_DETAIL_ADDED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get boat list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async boatList(req, res, next) {
    try {
      const result = await boatRepository.getBoatList(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_LIST'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get owner boat list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async manageBoatList(req, res, next) {
    try {
      req.query.scope = 'manageBoat';
      const result = await boatRepository.getBoatList(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BOAT_LIST'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get boat detail
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async boatDetail(req, res, next) {
    try {
      const { boatInfo } = req;
      res.status(HttpStatus.OK).json({
        success: true,
        data: boatInfo,
        message: utility.getMessage(req, false, 'BOAT_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Boat Status
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateBoatStatus(req, res, next) {
    try {
      await boatRepository.updateBoatStatus(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: [],
        message: utility.getMessage(req, false, 'BOAT_STATUS_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Boat Recommend
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async boatRecommend(req, res, next) {
    try {
      const {
        params: { id },
        body: { isRecommended },
      } = req;
      await boatRepository.boatRecommend({ id, isRecommended });
      res.status(HttpStatus.OK).json({
        success: true,
        data: [],
        message: utility.getMessage(req, false, 'BOAT_STATUS_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Boat Booking Active and Inactive by admin
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async boatIsBookingStatus(req, res, next) {
    try {
      const {
        params: { id },
        body: { isBooking },
      } = req;
      await boatRepository.boatIsBookingStatus({ id, isBooking });
      res.status(HttpStatus.OK).json({
        success: true,
        data: [],
        message: utility.getMessage(req, false, 'BOAT_STATUS_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   *  Get boat booking transaction list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBoatBookingTransaction(req, res, next) {
    try {
      const result = await boatRepository.getBoatBookingTransaction(req);
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
   * Delete boat
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async deleteBoat(req, res, next) {
    try {
      const result = await boatRepository.deleteBoat(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BOAT_DELETE'),
      });
    } catch (error) {
      next(error);
    }
  },

};
