import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { DateTime } from 'luxon';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import config from '../config';
import language from '../language';
import models from '../models';

dayjs.extend(utc);
dayjs.extend(timezone);

const { user } = models;
export default {
  convertFormat(dateTime, format = 'YYYY-MM-DD') {
    return dayjs(dateTime).format(format);
  },

  /**
   * @param dateStr Date string 2024-08-28T18:30:00.000Z
   * Outputs: "Aug 29 2024"
   */
  formatDate(dateStr) {
    return dayjs(dateStr).format('MMM D YYYY');
  },

  getCurrentDateFormat(format) {
    return dayjs().format(format ?? 'YYYY-MM-DD');
  },

  getUtcCurrentDateFormat(format) {
    const currentUTCDateTime = dayjs.utc();
    return currentUTCDateTime.format(format ?? 'YYYY-MM-DD');
  },

  getCurrentDateTimeByTimezone(format, timeZoneValue) {
    return dayjs().tz(timeZoneValue).format(format ?? 'YYYY-MM-DD');
  },

  currentStartEndTimeByTimezone(timeZoneValue) {
    const today = dayjs().tz(timeZoneValue);
    const startTime = today.startOf('day');
    const endTime = today.endOf('day');
    const formattedStartTime = startTime.format('YYYY-MM-DD HH:mm:ss');
    const formattedEndTime = endTime.format('YYYY-MM-DD HH:mm:ss');
    return { todayStartTime: formattedStartTime, todayEndTime: formattedEndTime };
  },

  getDateDifference(startDate, endDate) {
    const date1 = dayjs(startDate);
    return date1.diff(endDate, 'day');
  },

  getSubtractDate() {
    return dayjs().subtract(15, 'day').toDate();
  },

  dateSubtract(startDate, endDate) {
    const date1 = dayjs(startDate);
    const date2 = dayjs(endDate);
    if (date1.isAfter(date2)) {
      // date1 is greater than date2
      return Math.floor(Math.abs(date1 - date2) / 86400000);
    }
    return 0;
  },

  dateIsAfter(startDate, endDate) {
    const date1 = dayjs(startDate);
    const date2 = dayjs(endDate);
    return date1.isAfter(date2);
  },

  /**
   * Get date of birth
   */
  getDob(date) {
    try {
      const dt = new Date(date);
      return {
        year: dt.getFullYear(),
        month: (dt.getMonth() + 1),
        day: dt.getDate(),
      };
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Generate random string
   * @param {Number} length
   */
  generateRandomString: (length) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let output = '';

    for (let x = 0; x < length; x++) {
      const i = Math.floor(Math.random() * 62);
      output += chars.charAt(i);
    }
    return output;
  },
  /**
   * Generate random integer
   */
  generateRandomInteger(length) {
    try {
      return Math.floor(10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1));
    } catch (error) {
      throw new Error(error);
    }
  },
  /**
   * Generate otp
   */
  generateOtp() {
    try {
      return config.app.environment === 'development'
        ? this.generateRandomInteger(4)
        : this.generateRandomInteger(4);
    } catch (error) {
      throw new Error(error);
    }
  },
  /**
   * Generate random password
   */
  generateRandomPassword() {
    return this.generateRandomString(8);
  },
  /**
   * Generate hash password
   * @param {String} dataString
   */
  async generateHashPassword(dataString) {
    try {
      const salt = await bcrypt.genSalt();
      return await bcrypt.hash(dataString, salt);
    } catch (error) {
      throw new Error(error);
    }
  },
  /**
   * Get date from dateTime
   */
  getDateFromDateTime(dateObject) {
    const date = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return `${year}-${month}-${date}`;
  },
  /**
   * Date add
   * @param {Date} date
   * @param {String} interval
   * @param {Number} units
   */
  dateAdd(date, interval, units) {
    let ret = new Date(date);
    const checkRollover = () => {
      if (ret.getDate() !== date.getDate()) ret.setDate(0);
    };
    switch (interval.toLowerCase()) {
      case 'year':
        ret.setFullYear(ret.getFullYear() + units);
        checkRollover();
        break;
      case 'quarter':
        ret.setMonth(ret.getMonth() + 3 * units);
        checkRollover();
        break;
      case 'month':
        ret.setMonth(ret.getMonth() + units);
        checkRollover();
        break;
      case 'week':
        ret.setDate(ret.getDate() + 7 * units);
        break;
      case 'day':
        ret.setDate(ret.getDate() + units);
        break;
      case 'hour':
        ret.setTime(ret.getTime() + units * 3600000);
        break;
      case 'minute':
        ret.setTime(ret.getTime() + units * 60000);
        break;
      case 'second':
        ret.setTime(ret.getTime() + units * 1000);
        break;
      default:
        ret = undefined;
        break;
    }
    return ret;
  },
  /**
   * Date minus
   * @param {Date} date
   * @param {String} interval
   * @param {Number} units
   */
  dateMinus(date, interval, units) {
    let ret = new Date(date);
    const checkRollover = () => {
      if (ret.getDate() !== date.getDate()) ret.setDate(0);
    };
    switch (interval.toLowerCase()) {
      case 'year':
        ret.setFullYear(ret.getFullYear() - units);
        checkRollover();
        break;
      case 'quarter':
        ret.setMonth(ret.getMonth() - 3 * units);
        checkRollover();
        break;
      case 'month':
        ret.setMonth(ret.getMonth() - units);
        checkRollover();
        break;
      case 'week':
        ret.setDate(ret.getDate() - 7 * units);
        break;
      case 'day':
        ret.setDate(ret.getDate() - units);
        break;
      case 'hour':
        ret.setTime(ret.getTime() - units * 3600000);
        break;
      case 'minute':
        ret.setTime(ret.getTime() - units * 60000);
        break;
      case 'second':
        ret.setTime(ret.getTime() - units * 1000);
        break;
      default:
        ret = undefined;
        break;
    }
    return ret;
  },
  /**
   * Convert iso dateTime to sql time
   * @param {string} dateTime
   */
  fromIsoToSQLTime(dateTime) {
    const dateTimeObj = DateTime.fromISO(dateTime, { zone: 'utc' });
    return (
      (dateTimeObj && dateTimeObj.toSQLTime({ includeOffset: false })) || null
    );
  },
  /**
   * Convert sql time to iso dateTime
   * @param {string} time
   */
  fromSQLTimeToIso(time, date) {
    if (time) {
      const [hour, minute, second] = time.split(':');
      const fromObject = {
        hour,
        minute,
        second,
        zone: 'utc',
      };
      if (date) {
        const dt = DateTime.fromJSDate(date, {
          zone: 'utc',
        });
        const { year, month, day } = dt;
        Object.assign(fromObject, {
          year,
          month,
          day,
        });
      }
      return DateTime.fromObject(fromObject);
    }
    return null;
  },
  /**
   * Check file exists
   * @param {string} path
   */
  isFileExist(filePath) {
    const tmpPath = path.join(__dirname, `../../${filePath}`);
    return fs.existsSync(tmpPath) || false;
  },

  /**
   * Get message
   * @param {variable} req
   * @param {object} data
   * @param {object} key
   * @returns
   */
  getMessage(req, data, key) {
    let message = '';
    let languageCode = req.headers && (req.headers.language || req.headers.language);
    languageCode = languageCode || 'en';
    if (data) {
      message = language[languageCode] && language.en[`${key}`]
        ? language[languageCode][`${key}`](data)
        : key;
    } else {
      message = language[languageCode] && language.en[`${key}`]
        ? language[languageCode][`${key}`]
        : key;
    }
    return message;
  },
  /**
   * Remove # from string
   * @param {string} path
   */
  removeHasTag(string) {
    return string.replace(/^#+/i, '');
  },
  /**
   * Check valid email or not
   * @param {string} path
   */
  validateEmail(email) {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  async replacePlusSign(countryCode) {
    return countryCode.replace('+', '');
  },

  /**
   * Admin get
   * @returns
   */
  async getAdmin() {
    try {
      const userScope = [
        {
          method: ['user', { where: {}, havingWhere: {}, attributes: ['id'] }],
        },
        { method: ['userRole', { whereRole: { role: 'admin' } }] },
      ];
      return await user.scope(userScope).findOne();
    } catch (error) {
      throw Error(error);
    }
  },

  jsonToString(obj = {}) {
    try {
      if (obj && typeof obj === 'object' && Object.keys(obj).length !== 0) {
        return JSON.stringify(obj);
      }
      return Object.keys(obj).length === 0 ? String(obj) : obj;
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Get message
   * @param {variable} req
   * @param {object} data
   * @param {object} key
   * @returns
   */
  getNotification(req, data, key) {
    let message = '';
    if (data) {
      message = language.notification && language.notification[`${key}`]
        ? language.notification[`${key}`](data)
        : key;
    } else {
      message = language.notification && language.notification[`${key}`]
        ? language.notification[`${key}`]
        : key;
    }
    return message;
  },

  /**
  * Get message
  * @param {variable} req
  * @param {object} data
  * @param {object} key
  * @returns
  */
  getEmail(req, data, key) {
    let message = '';
    if (data) {
      message = language.email && language.email[`${key}`]
        ? language.email[`${key}`](data)
        : key;
    } else {
      message = language.email && language.email[`${key}`]
        ? language.email[`${key}`]
        : key;
    }
    return message;
  },

  /**
   * Get notification message
   * @param {variable} req
   * @param {object} data
   * @param {object} key
   * @returns
   */
  async getNotificationMessage(req, data, result) {
    try {
      let message = '';
      if (data.type === 'BOAT_BOOKING') {
        message = this.getNotification(req, false, data.type);
        const convertedData = this.convertFormat(result?.bookingDate, 'MM-DD-YYYY');
        return message.replace('{boatName}', `${result?.boat?.name}`).replace('{renterName}', `${result?.user?.firstName} ${result?.user?.lastName ?? ''}`).replace('{date}', `${convertedData}`);
      }
      if (data.type === 'EVENT_BOOKING') {
        message = this.getNotification(req, false, data.type);
        const convertedData = this.convertFormat(result?.event?.eventDate, 'MM-DD-YYYY');
        return message.replace('{eventName}', `${result?.event?.name}`).replace('{adult}', `${result?.adults}`).replace('{children}', `${result?.children}`).replace('{renterName}', `${result?.user?.firstName} ${result?.user?.lastName ?? ''}`)
          .replace('{date}', `${convertedData}`);
      }
      if (data.type === 'BOAT_BOOKING_CANCELLATION_FOR_OWNER') {
        message = this.getNotification(req, false, data.type);
        const convertedData = this.convertFormat(result?.bookingDate, 'MM-DD-YYYY');
        return message.replace('{boatName}', `${result?.boat?.name}`).replace('{renterName}', `${result?.user?.firstName} ${result?.user?.lastName ?? ''}`).replace('{date}', `${convertedData}`);
      }
      if (data.type === 'BOAT_BOOKING_CANCELLATION_FOR_ADMIN') {
        message = this.getNotification(req, false, data.type);
        const convertedData = this.convertFormat(result?.bookingDate, 'MM-DD-YYYY');
        return message.replace('{boatName}', `${result?.boat?.name}`).replace('{date}', `${convertedData}`);
      }
      if (data.type === 'BOAT_BOOKING_CANCELLATION_FOR_RENTER') {
        message = this.getNotification(req, false, data.type);
        const convertedData = this.convertFormat(result?.bookingDate, 'MM-DD-YYYY');
        return message.replace('{boatName}', `${result?.boat?.name}`).replace('{ownerName}', `${result?.owner?.firstName} ${result?.owner?.lastName ?? ''}`).replace('{date}', `${convertedData}`).replace('{reason}', `${data?.reason}`);
      }
      if (data.type === 'EVENT_BOOKING_CANCELLATION') {
        message = this.getNotification(req, false, data.type);
        const convertedData = this.convertFormat(result?.event?.eventDate, 'MM-DD-YYYY');
        return message.replace('{eventName}', `${result?.event?.name}`).replace('{adult}', `${result?.adults}`).replace('{children}', `${result?.children}`).replace('{renterName}', `${result?.user?.firstName} ${result?.user?.lastName ?? ''}`)
          .replace('{date}', `${convertedData}`);
      }
      if (data.type === 'BOAT_BOOKING_REQUEST') {
        message = this.getNotification(req, false, data.type);
        const convertedData = this.convertFormat(result?.bookingRequestDate, 'MM-DD-YYYY');
        return message.replace('{boatName}', `${result?.name}`).replace('{renterName}', `${result?.renterName}`).replace('{date}', `${convertedData}`);
      }
      if (data.type === 'USER_DOCUMENT_UPLOAD') {
        message = this.getNotification(req, false, data.type);
        return message.replace('{user}', `${result?.user?.firstName} ${result?.user?.lastName ?? ''}`);
      }
      if (data.type === 'USER_DOCUMENT_UPLOAD_STATUS') {
        message = this.getNotification(req, false, data.type);
        let status = result?.updatedData?.status;
        if (status === 'approve') {
          status = 'approved';
        }
        if (status === 'reject') {
          status = 'rejected';
        }
        return message.replace('{status}', `${status}`);
      }
      if (data.type === 'REVIEW') {
        message = this.getNotification(req, false, data.type);
        return message.replace('{boatName}', `${result?.boatInfo?.name}`);
      }
      if (data.type === 'BOAT_BOOKING_REFUND') {
        message = this.getNotification(req, false, data.type);
        return message;
      }
      if (data.type === 'EVENT_BOOKING_REFUND') {
        message = this.getNotification(req, false, data.type);
        return message;
      }
      if (data.type === 'CONTACT_SUPPORT') {
        message = this.getNotification(req, false, data.type);
        return message.replace('{user}', `${result?.firstName} ${result?.lastName ?? ''}`);
      }
      if (data.type === 'NEW_BOAT_ADDED') {
        message = this.getNotification(req, false, data.type);
        return message;
      }
      if (data.type === 'BOAT_LISTED') {
        message = this.getNotification(req, false, data.type);
        return message.replace('{boatName}', `${result?.name}`);
      }
      if (data.type === 'BOAT_UNLISTED') {
        message = this.getNotification(req, false, data.type);
        return message.replace('{boatName}', `${result?.name}`);
      }
      return message;
    } catch (error) {
      throw Error(error);
    }
  },

  /**
  * Get notification message
  * @param {variable} req
  * @param {object} data
  * @param {object} key
  * @returns
  */
  async getEmailMessage(req, data, result) {
    try {
      let message = '';
      if (data.type === 'RECEIVED_MESSAGE_FOR_OWNER') {
        message = this.getEmail(req, false, data.type);
        return message.replace('{renterName}', `${result?.firstName} ${result?.lastName ?? ''}`);
      }
      if (data.type === 'RECEIVED_MESSAGE_FOR_RENTER') {
        message = this.getEmail(req, false, data.type);
        return message.replace('{ownerName}', `${result?.firstName} ${result?.lastName ?? ''}`);
      }
      if (data.type === 'PRE_BOOKING_APPROVAL_FOR_RENTER') {
        message = this.getEmail(req, false, data.type);
        return message
      }
      if (data.type === 'BOAT_BOOKING_REQUEST') {
        message = this.getEmail(req, false, data.type);
        return message.replace('{renterName}', `${result?.renterName}`);
      }
      if (data.type === 'BOAT_LISTING_FOR_ADMIN') {
        message = this.getEmail(req, false, data.type);
        return message.replace('{ownerName}', `${result?.user?.firstName} ${result?.user?.lastName ?? ''}`);
      }
      if (data.type === 'BOAT_LISTED_FOR_OWNER') {
        message = this.getEmail(req, false, data.type);
        return message.replace('{boatName}', `${result?.name}`);
      }
      if (data.type === 'BOAT_UNLISTED_FOR_OWNER') {
        message = this.getEmail(req, false, data.type);
        return message.replace('{boatName}', `${result?.name}`);
      }
      if (data.type === 'DOCUMENTS_APPROVED_FOR_OWNER') {
        message = this.getEmail(req, false, data.type);
        return message
      }
      if (data.type === 'DOCUMENTS_RECEIVED_FOR_ADMIN') {
        message = this.getEmail(req, false, data.type);
        return message.replace('{ownerName}', `${result?.firstName ?? "user"} ${result?.lastName ?? ''}`);
      }
      if (data.type === 'BOAT_BOOKING_CANCELLATION_FOR_OWNER') {
        message = this.getEmail(req, false, data.type);
        return message.replace('{boatName}', `${result?.boat?.name}`);
      }
      if (data.type === 'BOAT_BOOKING_CANCELLATION_FOR_RENTER') {
        message = this.getEmail(req, false, data.type);
        const convertedData = this.convertFormat(result?.bookingDate, 'MM-DD-YYYY');
        return message.replace('{boatName}', `${result?.boat?.name}`).replace('{ownerName}', `${result?.owner?.firstName} ${result?.owner?.lastName ?? ''}`).replace('{date}', `${convertedData}`).replace('{reason}', `${data?.reason}`);
      }
      if (data.type === 'BOAT_BOOKING_CONFIRMATION_FOR_OWNER') {
        message = this.getEmail(req, false, data.type);
        return message.replace('{boatName}', `${result?.boat?.name}`).replace('{renterName}', `${result?.user?.firstName} ${result?.user?.lastName ?? ''}`);
      }
      if (data.type === 'TICKET_BOUGHT_FOR_RENTER') {
        message = this.getEmail(req, false, data.type);
        return message.replace('{eventName}', `${result?.event?.name}`);
      }
      if (data.type === 'USER_DOCUMENT_STATUS') {
        let status = result?.status;
        if (status === 'approve') {
          message = this.getEmail(req, false, "DOCUMENTS_APPROVED_FOR_USER")
          message = message.replace('{boatName}', `${result?.name}`);
        }
        if (status === 'reject') {
          message = this.getEmail(req, false, "DOCUMENT_REJECTED_FOR_USER");
          message = message.replace('{status}', "rejected");
        }
        return message
      }
      if (data.type === 'EVENT_BOOKING_CANCELLATION') {
        message = this.getNotification(req, false, data.type);
        const convertedData = this.convertFormat(result?.event?.eventDate, 'MM-DD-YYYY');
        return message.replace('{eventName}', `${result?.event?.name}`).replace('{adult}', `${result?.adults}`).replace('{children}', `${result?.children}`).replace('{renterName}', `${result?.user?.firstName} ${result?.user?.lastName ?? ''}`)
          .replace('{date}', `${convertedData}`);
      }
      if (data.type === 'PAYOUT_FOR_OWNER') {
        message = this.getEmail(req, false, data.type);
        return message
      }
      return message;
    } catch (error) {
      throw Error(error);
    }
  },

  /**
   * Custom Error
   * @param {variable} req
   * @param {string} message
   * @param {number} errorCode
   * @returns
   */
  customError(req, message, errorCode) {
    return Object.assign(new Error(this.getMessage(req, false, message)), { errorCode });
  },

  getImage(str, defaultIcon) {
    try {
      if (str) {
        const { app, aws } = config;
        if (app.mediaStorage === 'local') {
          if (!this.isFileExist(`${str}`)) {
            return defaultIcon;
          }
          return (str && `${config.app.baseUrl}${str}`) || '';
        }
        if (app.mediaStorage === 's3') {
          return `${aws.s3BucketUrl}${str}`;
        }
        return defaultIcon;
      }
      return defaultIcon;
    } catch (error) {
      throw new Error(error);
    }
  },

  calculatePercentage(baseAmount, percent) {
    return ((Number(baseAmount) / 100) * Number(percent))
  },

  // Function to convert ISO 8601 datetime to MySQL DATETIME format
  formatDateToFull(dateStr) {
    return dayjs(dateStr).format('YYYY-MM-DD HH:mm:ss');
  }
};
