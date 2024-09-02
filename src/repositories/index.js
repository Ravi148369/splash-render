import userRepository from './user-repository';
import mediaRepository from './media-repository';
import accountRepository from './account-repository';
import stateRepository from './state-repository';
import countryRepository from './country-repository';
import languageRepository from './language-repository';
import notificationRepository from './notifications-repository';
import staticContentManagementRepository from './static-content-management-repository';
import currencyRepository from './currency-repository';
import boatRepository from './boat-repository';
import eventRepository from './event-repository';
import popularLocationRepository from './popular-location-repository';
import blogRepository from './blog-repository';
import userDocumentRepository from './user-document-repository';
import ownerPageSettingRepository from './owner-page-setting-repository';
import boatSettingRepository from './boat-settings';
import aboutUsPageSettingRepository from './about-us-page-setting-repository';
import reviewRepository from './review-repository';
import bookingRepository from './booking-repository';
import favoriteListRepository from './favorite-list-repository';
import favoriteBoatRepository from './favorite-boat-repository';
import siteSettingRepository from './site-setting-repository';
import favoriteEventRepository from './favorite-event-repository';
import bookingMessageRepository from './booking-message-repository';
import bankAccountRepository from './bank-account-repository';
import serviceFeesRepository from './service-fees-repository';
import supportRepository from './support-repository';
import reportRepository from './report-repository';
import salesTaxRepository from './sales-tax-repository';

export default {
  userRepository,
  mediaRepository,
  accountRepository,
  stateRepository,
  countryRepository,
  languageRepository,
  notificationRepository,
  staticContentManagementRepository,
  currencyRepository,
  boatRepository,
  eventRepository,
  popularLocationRepository,
  blogRepository,
  userDocumentRepository,
  ownerPageSettingRepository,
  ...boatSettingRepository,
  aboutUsPageSettingRepository,
  reviewRepository,
  bookingRepository,
  favoriteListRepository,
  favoriteBoatRepository,
  siteSettingRepository,
  favoriteEventRepository,
  bookingMessageRepository,
  bankAccountRepository,
  serviceFeesRepository,
  salesTaxRepository,
  supportRepository,
  reportRepository,
};
