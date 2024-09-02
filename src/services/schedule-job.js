import loggers from './logger';
import repositories from '../repositories';

const { mediaRepository, bookingRepository } = repositories;

export default {
  /**
    * delete media schedule
    */
  async deleteMedia() {
    try {
      await mediaRepository.findAllAndRemove();
    } catch (error) {
      loggers.dailyLogger('scheduleJobError').error(new Error(error));
    }
  },

  /**
    * Delete Pending Bookings
    */
  async deletePendingBookings() {
    try {
      await bookingRepository.removePendingBoatBooking();
      await bookingRepository.removePendingEventBooking();
      await bookingRepository.removeBookingLog();
    } catch (error) {
      loggers.dailyLogger('scheduleJobError').error(new Error(error));
    }
  },

};
