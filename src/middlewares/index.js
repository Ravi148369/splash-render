import validateMiddleware from './validate-middleware';
import authMiddleware from './auth-middleware';
import resourceAccessMiddleware from './resource-access-middleware';
import userMiddleware from './user-middleware';
import accountMiddleware from './account-middleware';
import staticContentManagementMiddleware from './static-content-management-middleware';
import mediaMiddleware from './media-middleware';
import appVersionMiddleware from './app-version-middleware';
import boatSettingMiddleware from './boat-setting-middleware';
import boatMiddleware from './boat-middleware';
import popularLocationMiddleware from './popular-location-middleware';
import blogMiddleware from './blog-middleware';
import reviewMiddleware from './review-middleware';
import eventMiddleware from './event-middleware';
import favoriteMiddleware from './favorite-middleware';
import bookingMiddleware from './booking-middleware';
import bookingMessageMiddleware from './booking-message-middleware';
import notificationMiddleware from './notification-middleware';
import reportMiddleware from './report-middleware';

export default {
  validateMiddleware,
  authMiddleware,
  resourceAccessMiddleware,
  appVersionMiddleware,
  accountMiddleware,
  userMiddleware,
  mediaMiddleware,
  staticContentManagementMiddleware,
  boatSettingMiddleware,
  boatMiddleware,
  popularLocationMiddleware,
  blogMiddleware,
  reviewMiddleware,
  eventMiddleware,
  favoriteMiddleware,
  bookingMiddleware,
  bookingMessageMiddleware,
  notificationMiddleware,
  reportMiddleware,
};
