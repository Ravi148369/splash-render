import accountController from './account-controller';
import mediaController from './media-controller';
import adminController from './admin-controller';
import userController from './user-controller';
import stateController from './state-controller';
import countryController from './country-controller';
import languageController from './language-controller';
import staticContentPageController from './static-content-management-controller';
import currencyController from './currency-controller';
import boatController from './boat-controller';
import eventController from './event-controller';
import popularLocationController from './popular-location-controller';
import blogController from './blog-controller';
import userDocumentController from './user-document-controller';
import ownerPageSettingController from './owner-page-setting-controller';
import boatSettingController from './boat-settings';
import aboutUsPageSettingController from './about-us-page-setting-controller';
import reviewController from './review-controller';
import bookingController from './booking-controller';
import favoriteListController from './favorite-list-controller';
import favoriteBoatController from './favorite-boat-controller';
import siteSettingController from './site-setting-controller';
import favoriteEventController from './favorite-event-controller';
import bookingMessageController from './booking-message-controller';
import bankAccountController from './bank-account-controller';
import serviceFeesController from './service-fees-controller';
import supportController from './support-controller';
import notificationController from './notification-controller';
import reportController from './report-controller';
import salesTaxController from './sales-tax-controller';

export default {
  accountController,
  mediaController,
  adminController,
  userController,
  stateController,
  countryController,
  languageController,
  staticContentPageController,
  currencyController,
  boatController,
  eventController,
  popularLocationController,
  blogController,
  userDocumentController,
  ownerPageSettingController,
  ...boatSettingController,
  aboutUsPageSettingController,
  reviewController,
  bookingController,
  favoriteListController,
  favoriteBoatController,
  siteSettingController,
  favoriteEventController,
  bookingMessageController,
  bankAccountController,
  serviceFeesController,
  salesTaxController,
  supportController,
  notificationController,
  reportController,
};
