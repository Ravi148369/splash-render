/* eslint-disable import/no-cycle */
/* eslint-disable radix */
import { Op, Sequelize } from 'sequelize';
import bcrypt from 'bcryptjs';
import mediaRepository from './media-repository';
import models from '../models';
import accountRepository from './account-repository';
import utility from '../services/utility';
import logMessage from '../logMessages/index';
import constant from '../constant';

const { commonConstant } = constant;
const {
  user,
  userNotification,
  boat,
  event,
  booking,
  eventBooking,
  userVerification,
  userDocument,
} = models;

export default {
  /**
   * Find user
   * @param {Object} where
   */
  async findOne(where) {
    try {
      const havingWhere = where.email ? { email: where.email } : {};
      const attributes = { exclude: ['password', 'verifyToken'] };
      const userScope = [
        { method: ['user', { where, havingWhere, attributes }] },
        { method: ['userRole', { whereRole: {} }] },
        { method: ['userVerification'] },
      ];
      return await user.scope(userScope).findOne();
    } catch (error) {
      logMessage.userErrorMessage('userDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Update user
   * @param {Object} userObject
   * @param {Object} data
   */
  async updateUser(userObject, data) {
    try {
      return await userObject.user.update(data);
    } catch (error) {
      logMessage.userErrorMessage('userUpdate', { error, data });
      throw Error(error);
    }
  },

  /**
   * Update password
   * @param {Object} userObject
   * @param {String} newPassword
   */
  async createHashPassword(password) {
    try {
      const salt = await bcrypt.genSalt();
      return await bcrypt.hash(password, salt);
    } catch (error) {
      logMessage.userErrorMessage('createPassword', { error });
      throw Error(error);
    }
  },

  /**
   * Update password
   * @param {Object} userObject
   * @param {String} newPassword
   */
  async updatePassword(userObject, newPassword) {
    try {
      const hashPassword = await this.createHashPassword(newPassword);
      return await userObject.update({
        password: hashPassword,
        passwordResetToken: null,
      });
    } catch (error) {
      logMessage.userErrorMessage('updatePassword', { error });
      throw Error(error);
    }
  },

  /**
   * User change password api
   * @param {Object} req
   */
  async changePassword(req) {
    try {
      const { id } = req.user;
      const userObject = await user.findOne({
        where: { id },
      });
      if (userObject) {
        const isPasswordMatch = await accountRepository.compareUserPassword(
          req.body.currentPassword,
          userObject.password,
        );
        if (!isPasswordMatch) {
          return { status: 'notmatched' };
        }
        await this.updatePassword(userObject, req.body.newPassword);
        return { status: 'changed' };
      }
      return false;
    } catch (error) {
      logMessage.userErrorMessage('changePassword', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * User change password api
   * @param {Object} req
   */
  async addPassword(req) {
    try {
      const userObject = await user.findOne({
        where: { id: req.body.id },
      });
      if (userObject) {
        await this.updatePassword(userObject, req.body.newPassword);
        return { status: 'changed' };
      }
      return false;
    } catch (error) {
      logMessage.userErrorMessage('createPassword', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Get user details
   * @param {Object} req
   */
  async getUserProfile(req) {
    try {
      const where = { id: req.params.userId };
      const attributes = {
        exclude: ['password', 'verificationOtp', 'passwordResetToken'],
      };

      const userScope = [
        { method: ['user', { where, havingWhere: {}, attributes }] },
        { method: ['userRole', { whereRole: {} }] },
      ];

      return await user.scope(userScope).findOne();
    } catch (error) {
      logMessage.userErrorMessage('userDetails', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Update user profile
   * @param {Object} req
   */
  async updateProfile(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const userData = req.user;
      const {
        firstName, lastName, email, profileImage, dateOfBirth, gender,
        countryCode, phoneNumber, language, currency, whereYouLive, describeYourself,
      } = req.body;
      const data = {
        firstName,
        lastName,
        email,
        profileImage,
        dateOfBirth,
        gender,
        countryCode,
        phoneNumber,
        language,
        currency,
        whereYouLive,
        describeYourself,
      };
      await user.update(
        data,
        { where: { id: userData.id } },
        { transaction },
      );
      // Update media detail
      await mediaRepository.makeUsedMedias([data.profileImage]);
      await transaction.commit();
      return await this.findOne({ id: userData.id });
    } catch (error) {
      await transaction.rollback();
      logMessage.userErrorMessage('userUpdate', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Update admin profile
   * @param {Object} req
   */
  async AdminUpdateProfile(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const userData = req.user;
      const {
        firstName, username,
      } = req.body;
      const data = {
        firstName,
        username,
      };
      await user.update(
        data,
        { where: { id: userData.id } },
        { transaction },
      );
      await transaction.commit();
      return await this.findOne({ id: userData.id });
    } catch (error) {
      await transaction.rollback();
      logMessage.userErrorMessage('userUpdate', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * signup new user
   * @param {Object} req
   */
  async signup(req) {
    try {
      const bodyData = req.body;
      const verificationOtp = await utility.generateOtp();
      const hashPassword = await this.createHashPassword(bodyData.password);
      bodyData.status = commonConstant.STATUS.PENDING;
      bodyData.password = hashPassword;
      bodyData.verificationOtp = verificationOtp;
      bodyData.userType = commonConstant.ROLE.USER;
      const result = await user.create(bodyData);
      if (result) {
        return result;
      }
      return false;
    } catch (error) {
      logMessage.userErrorMessage('signup', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Get user count
   *
   */
  async getUserCount() {
    try {
      const where = {
        status: { [Op.in]: [commonConstant.STATUS.ACTIVE, commonConstant.STATUS.INACTIVE] },
      };
      return await user.count({ where });
    } catch (error) {
      logMessage.userErrorMessage('count', { error });
      throw Error(error);
    }
  },

  /**
   * Get all user list
   * @param {Object} req
   */
  async getUserList(req) {
    try {
      const queryData = req.query;
      const sortFields = [
        'id',
        'name',
        'email',
        'phoneNumber',
        'createdAt',
        'updatedAt',
      ];
      let orderBy = [['createdAt', 'DESC']];
      let fullNameWhere = {};
      let where = {};

      if (queryData.search) {
        fullNameWhere = Sequelize.where(
          Sequelize.fn(
            'CONCAT_WS',
            ' ',
            Sequelize.col('first_name'),
            Sequelize.fn('coalesce', Sequelize.col('last_name'), ''),
          ),
          {
            [Op.like]: `%${queryData.search}%`,
          },
        );
        fullNameWhere = { [Op.or]: [{ fullNameWhere }, { email: { [Op.like]: `%${queryData.search}%` } }, { phoneNumber: { [Op.like]: `%${queryData.search}%` } }] };
      }

      if (queryData.email) {
        where.email = { [Op.like]: `%${queryData.email}%` };
      }
      if (queryData.phoneNumber) {
        where.phoneNumber = { [Op.like]: `%${queryData.phoneNumber}%` };
      }
      if (queryData.country) {
        where.phoneNumberCountry = queryData.country;
      }
      if (queryData.status) {
        where.status = queryData.status;
      }
      if (
        queryData.sortBy
        && queryData.sortType
        && sortFields.includes(queryData.sortBy)
      ) {
        if (queryData.sortBy === 'name') {
          orderBy = [
            [
              Sequelize.fn(
                'CONCAT_WS',
                ' ',
                Sequelize.col('user.first_name'),
                Sequelize.col('user.last_name'),
              ),
              queryData.sortType,
            ],
          ];
        } else {
          orderBy = [[queryData.sortBy, queryData.sortType]];
        }
      }
      where = { [Op.and]: [fullNameWhere, where] };
      const attributes = { exclude: ['password'] };
      const userScope = [
        { method: ['user', { where, havingWhere: {}, attributes }] },
        { method: ['userRole', { whereRole: { role: { [Op.ne]: commonConstant.ROLE.ADMIN } } }] },
        { method: ['userBankAccount'] },
      ];
      return await user.scope(userScope).findAndCountAll({
        order: orderBy,
        limit: parseInt(queryData.limit || 10),
        offset: parseInt(queryData.offset || 0),
      });
    } catch (error) {
      logMessage.userErrorMessage('userList', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * verify otp
   * @param {Object} req
   */
  async verifyOtp(req) {
    try {
      const { phoneNumberCountryCode, phoneNumber, otp } = req.body;
      const where = {
        phoneNumberCountryCode,
        phoneNumber,
        verificationOtp: otp,
      };
      const userData = await this.findOne(where);
      if (userData) {
        return await userData.update({
          verificationOtp: null,
          status: commonConstant.STATUS.ACTIVE,
        });
      }
      return false;
    } catch (error) {
      logMessage.userErrorMessage('verifyOtp', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Resend otp
   * @param {Object} req
   */
  async resendOtp(req) {
    try {
      const verificationOtp = await utility.generateOtp();
      const { phoneNumberCountryCode, phoneNumber } = req.body;
      const where = {
        phoneNumberCountryCode,
        phoneNumber,
      };
      const userData = await this.findOne(where);
      if (userData) {
        await userData.update({
          verificationOtp,
        });
        return userData;
      }
      return false;
    } catch (error) {
      logMessage.userErrorMessage('resendOtp', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Check email, mobile number and email
   * @param {Object} where
   */
  async checkUserEmailExists(where) {
    try {
      const havingWhere = {
        [Op.or]: [
          { email: { [Op.eq]: where.email } },
          {
            username: {
              [Op.eq]: where.username,
            },
          },
          {
            phoneNumber: { [Op.eq]: where.phoneNumber },
          },
        ],
      };
      const whereRole = {};
      const whereUser = {};
      if (where.userId) {
        whereUser.id = { [Op.ne]: where.userId };
      }
      if (!where.role) {
        whereRole.role = { [Op.in]: [commonConstant.ROLE.ADMIN] };
      }
      const userScope = [
        { method: ['user', { where: whereUser, havingWhere }] },
        { method: ['userRole', { whereRole }] },
      ];
      return await user.scope(userScope).findOne();
    } catch (error) {
      logMessage.userErrorMessage('emailExist', { error });
      throw Error(error);
    }
  },

  /**
   * Update user Status
   * @param {object} data
   * @returns
   */
  async updateUserStatus(data) {
    try {
      const where = { id: data.id };
      const userData = await user.findOne({ where });

      const userStatus = data.status;
      return await userData.update({ status: userStatus });
    } catch (error) {
      logMessage.userErrorMessage('userUpdateStatus', {
        error,
        data,
      });
      throw Error(error);
    }
  },

  /**
   * Get user with user profile
   * @param {Object} where
   */
  async getUserDetail(where) {
    try {
      const userData = await user.findOne({ where });
      return userData;
    } catch (error) {
      logMessage.userErrorMessage('userDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Get user device token from user id
   * @param {Integer} userId
   */
  async getUserNotificationCount(userId) {
    try {
      const where = {
        toUserId: userId,
        readStatus: commonConstant.NOTIFICATION.READ_STATUS.UNREAD,
      };
      return await userNotification.count({
        where,
      });
    } catch (error) {
      logMessage.userErrorMessage('notificationCount', {
        error,
      });
      throw Error(error);
    }
  },

  /**
   * Get admin dashboard details
   */
  async getDashboardDetail() {
    try {
      const data = {};
      // TOTAL USERS
      const where = {
        id: { [Op.ne]: 1 },
      };
      const userData = await user.findAll({ where });
      data.totalUser = (userData.length > 0) ? userData.length : 0;

      // TOTAL LISTINGS
      const boatData = await boat.findAll();
      data.totalBoat = (boatData.length > 0) ? boatData.length : 0;

      // TOTAL BOAT BOOKING
      const boatBooking = await booking.findAll();
      data.totalBoatBooking = (boatBooking.length > 0) ? boatBooking.length : 0;

      // TOTAL EVENTS
      const eventData = await event.findAll();
      data.totalEvent = (eventData.length > 0) ? eventData.length : 0;

      // TOTAL EVENT BOOKING
      const eventBookingData = await eventBooking.findAll();
      data.totalEventBooking = (eventBookingData.length > 0) ? eventBookingData.length : 0;

      // TOTAL ADMIN BOOKING
      const adminBookingData = await booking.findAll({ where: { userId: 1 } });
      data.totalMyBooking = (adminBookingData.length > 0) ? adminBookingData.length : 0;

      return data;
    } catch (error) {
      logMessage.userErrorMessage('dashboardDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Get profile completion percentage
   * @param {object} req
   */
  async getProfileCompletion(req) {
    try {
      const { id } = req.user;
      const userObject = await user.findOne({
        where: { id },
      });
      let completeCount = 3;
      if (userObject) {
        completeCount += (userObject?.profileImage) ? 1 : 0;
        completeCount += (userObject?.lastName) ? 1 : 0;
        completeCount += (userObject?.gender) ? 1 : 0;
        completeCount += (userObject?.phoneNumber) ? 1 : 0;
        completeCount += (userObject?.language) ? 1 : 0;
        completeCount += (userObject?.currency) ? 1 : 0;
        completeCount += (userObject?.whereYouLive) ? 1 : 0;
        completeCount += (userObject?.describeYourself) ? 1 : 0;
      }
      const verification = await userVerification.findOne({
        where: { userId: id },
      });
      if (verification) {
        completeCount += (verification?.isEmailVerified) ? 1 : 0;
        completeCount += (verification?.isFacebookVerified) ? 1 : 0;
        completeCount += (verification?.isGoogleVerified) ? 1 : 0;
      }
      const document = await userDocument.findOne({
        where: { userId: id },
      });
      if (document) {
        completeCount += 1;
      }
      const percentage = Math.floor((completeCount * 100) / 15);
      return { percentage };
    } catch (error) {
      logMessage.userErrorMessage('dashboardDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Get owner detail
   * @param {Object} where
   */
  async getOwnerDetail(req) {
    try {
      const { params: { id } } = req;
      const attributes = { exclude: ['password', 'verifyToken'] };
      const userScope = [
        { method: ['user', { where: { id }, attributes }] },
        { method: ['userRole', { whereRole: {} }] },
        { method: ['userVerification'] },
      ];
      return await user.scope(userScope).findOne();
    } catch (error) {
      logMessage.userErrorMessage('userDetails', { error });
      throw Error(error);
    }
  },

};
