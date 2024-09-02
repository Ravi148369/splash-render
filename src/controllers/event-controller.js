import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { eventRepository } = repositories;

export default {
  /**
   * Add event
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addEvent(req, res, next) {
    try {
      const result = await eventRepository.createEvent(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'EVENT_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get event list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getEvents(req, res, next) {
    try {
      const result = await eventRepository.getEvents(req);
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
   * get event Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getEventDetail(req, res, next) {
    try {
      const result = req.eventInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'EVENT_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update event detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateEvent(req, res, next) {
    try {
      const result = await eventRepository.updateEvent(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'EVENT_UPDATED'),
      });
    } catch (error) {
      console.log(error);
      
      next(error);
    }
  },

  /**
   *  Get event booking transaction list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getEventBookingTransaction(req, res, next) {
    try {
      const result = await eventRepository.getEventBookingTransaction(req);
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
   *  Delete event
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async cancelEvent(req, res, next) {
    try {
      const result = await eventRepository.cancelEvent(req);
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
