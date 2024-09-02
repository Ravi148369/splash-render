/* eslint-disable import/no-cycle */
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import winston from 'winston';
import Email from '../services/email';
import utility from '../services/utility';
import logMessage from '../logMessages/index';
import jwt from '../services/jwt';
import models from '../models';
import userRepository from './user-repository';
import constant from '../constant';
import mediaRepository from './media-repository';

const { commonConstant } = constant;
const {
  user, userDevice, userRole, role, userVerification,
} = models;

export default {
  /**
   * Check admin email and password for login
   * @param {Object} req
   * @returns
   */
  async checkLogin(req) {
    try {
      const {
        email, password, deviceType, deviceId, firebaseToken,
      } = req.body;
      const havingWhere = { email };
      const attributes = {
        exclude: ['passwordResetToken', 'createdAt', 'updatedAt'],
      };
      const userScope = [
        { method: ['user', { where: {}, havingWhere, attributes }] },
        { method: ['userRole', { whereRole: {} }] },
      ];
      const userResult = await user.scope(userScope).findOne();
      if (userResult && userResult.userRole.role.role === commonConstant.ROLE.ADMIN) {
        if (userResult.status === commonConstant.STATUS.ACTIVE) {
          const isPasswordMatch = await this.compareUserPassword(
            password,
            userResult.password,
          );
          if (isPasswordMatch) {
            const { ...userData } = userResult.get();
            const token = jwt.createToken(userData);
            const deviceData = {
              userId: userData.id,
              token,
              deviceId,
              deviceType,
              userResult,
              firebaseToken,
            };
            await this.addUpdateUserDevice(deviceData);
            return { token, ...userData };
          }
        } else {
          return { status: commonConstant.STATUS.INACTIVE };
        }
      }
      return { status: commonConstant.STATUS.INVALID };
    } catch (error) {
      logMessage.accountErrorMessage('accountLogin', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Check user email and password for login
   * @param {Object} req
   * @returns
   */
  async checkUserAccountLogin(req) {
    try {
      const {
        email, password, deviceType, deviceId, firebaseToken,
      } = req.body;
      const havingWhere = { email };
      const attributes = { exclude: ['updatedAt'] };
      const userScope = [
        { method: ['user', { where: {}, havingWhere, attributes }] },
        { method: ['userRole', { whereRole: {} }] },
      ];
      const userResult = await user.scope(userScope).findOne();
      if (userResult && userResult.userRole.role.role !== commonConstant.ROLE.ADMIN) {
        if (userResult.status === commonConstant.STATUS.ACTIVE) {
          const userVerificationData = await userVerification.findOne(
            { where: { userId: userResult.id } },
          );
          if (userVerificationData?.isEmailVerified === 1) {
            const isPasswordMatch = await this.compareUserPassword(
              password,
              userResult.password,
            );
            if (isPasswordMatch) {
              const { ...userData } = userResult.get();
              const token = jwt.createToken(userData);
              const deviceData = {
                userId: userData.id,
                token,
                deviceId,
                deviceType,
                firebaseToken,
                userResult,
              };
              await this.addUpdateUserDevice(deviceData);
              return { token, ...userData };
            }
          } else {
            req.user = userResult;
            this.verificationOtpSend(req);
            return { status: 'otpResend' };
          }
        } else {
          return { status: commonConstant.STATUS.INACTIVE };
        }
      }
      return { status: commonConstant.STATUS.INVALID };
    } catch (error) {
      logMessage.accountErrorMessage('accountLogin', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * user signup
   * @param {Object} req
   * @returns
   */
  async userSignup(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const bodyData = req.body;
      const hashPassword = await userRepository.createHashPassword(
        bodyData.password,
      );
      bodyData.password = hashPassword;
      const userData = await user.create(bodyData, { transaction });
      const roleData = await role.findOne({ where: { role: commonConstant.ROLE.USER } });
      if (userData) {
        const data = {
          userId: userData.id,
          roleId: roleData.id,
        };
        await userRole.create(data, { transaction });
        await transaction.commit();
        req.user = userData;
        this.verificationOtpSend(req);
      }
      return true;
    } catch (error) {
      await transaction.rollback();
      logMessage.accountErrorMessage('accountSignup', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * user social signup
   * @param {Object} req
   * @returns
   */
  async userSocialSignup(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const bodyData = req.body;
      const hashPassword = await userRepository.createHashPassword(
        utility.generateRandomPassword(),
      );
      bodyData.password = hashPassword;
      const userData = await user.create(bodyData, { transaction });
      const roleData = await role.findOne({ where: { role: commonConstant.ROLE.USER } });
      if (userData) {
        const data = {
          userId: userData.id,
          roleId: roleData.id,
        };
        await userRole.create(data, { transaction });
        await transaction.commit();
        const userInfoData = await userRepository.findOne({ email: userData.email });
        const token = jwt.createToken(userInfoData?.dataValues);
        const deviceData = {
          userId: userData.id,
          token,
          deviceId: bodyData.deviceId,
          deviceType: bodyData.deviceType,
          firebaseToken: bodyData.firebaseToken,
          userResult: userInfoData,
        };
        await this.addUpdateUserDevice(deviceData);
        if (req.body.type === 'google') {
          await userVerification.create({ userId: userInfoData?.id, isGoogleVerified: 1 });
        }
        if (req.body.type === 'facebook') {
          await userVerification.create({ userId: userInfoData?.id, isFacebookVerified: 1 });
        }
        req.userInfo = { token, ...userInfoData?.dataValues };
      }
      return true;
    } catch (error) {
      await transaction.rollback();
      logMessage.accountErrorMessage('accountSignup', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * User account verify
   * @param {Object} req
   * @returns
   */
  async userAccountVerify(req) {
    try {
      const { user: { id } } = req;
      if (req.googleResult) {
        const googleData = req?.googleResult;
        const userInfoData = await userRepository.findOne({ email: googleData?.email });
        if (userInfoData) {
          const userVerificationData = await userVerification.findOne(
            { where: { userId: id } },
          );
          if (userVerificationData && userVerificationData?.isGoogleVerified === 0) {
            await userVerification.update(
              { isGoogleVerified: 1 },
              { where: { userId: id } },
            );
          }
          if (!userVerificationData && userVerificationData?.isGoogleVerified !== 0) {
            await userVerification.create({ userId: id, isGoogleVerified: 1 });
          }
        }
      }
      if (req.facebookResult) {
        const facebookData = req?.body;
        const userInfoData = await userRepository.findOne({ email: facebookData?.email });
        if (userInfoData) {
          const userVerificationData = await userVerification.findOne(
            { where: { userId: id } },
          );
          if (userVerificationData && userVerificationData?.isFacebookVerified === 0) {
            await userVerification.update(
              { isFacebookVerified: 1 },
              { where: { userId: id } },
            );
          }
          if (!userVerificationData && userVerificationData?.isFacebookVerified !== 0) {
            await userVerification.create({ userId: id, isFacebookVerified: 1 });
          }
        }
      }
      return true;
    } catch (error) {
      logMessage.accountErrorMessage('accountVerification', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * User account verify
   * @param {Object} req
   * @returns
   */
  async getUserVerification(req) {
    try {
      const { user: { id } } = req;
      const where = { userId: id };
      return await userVerification.findOne({
        where,
      });
    } catch (error) {
      logMessage.accountErrorMessage('accountVerificationDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Add or update user device
   * @param {Object} data
   * @returns
   */
  async addUpdateUserDevice(data) {
    try {
      const userDeviceToken = await this.getUserDeviceToken(data.userId);
      const {
        userId, token, deviceId, deviceType, firebaseToken,
      } = data;
      if (userDeviceToken && data.userResult.userRole.role.role !== commonConstant.ROLE.ADMIN) {
        const newData = {
          token,
          deviceId,
          firebaseToken,
          deviceType,
        };
        await this.updateUserDevice(userDeviceToken, newData);
      } else {
        const updateData = {
          userId,
          token,
          deviceId,
          firebaseToken,
          deviceType,
        };
        await this.addUserDevice(updateData);
      }
    } catch (error) {
      logMessage.accountErrorMessage('addUpdateUserDevice', {
        error,
        data,
      });
      throw Error(error);
    }
  },

  /**
   * Compare user password
   * @param {String} password
   * @param {String} hashPassword
   * @returns
   */
  async compareUserPassword(password, hashPassword) {
    try {
      let isPasswordMatch = '';
      if (password && hashPassword) {
        isPasswordMatch = await bcrypt.compare(password, hashPassword);
      }
      return !!isPasswordMatch;
    } catch (error) {
      logMessage.accountErrorMessage('comparePassword', { error });
      throw Error(error);
    }
  },

  /**
   * Get user device token from user id
   * @param {Number} userId
   * @returns
   */
  async getUserDeviceToken(userId) {
    try {
      return await userDevice.findOne({
        where: { userId },
      });
    } catch (error) {
      logMessage.accountErrorMessage('userDeviceToken', { error });
      throw Error(error);
    }
  },

  /**
   * Update user device
   * @param {Object} userDeviceObject
   * @param {Object} data
   * @returns
   */
  async updateUserDevice(userDeviceObject, data) {
    try {
      return await userDeviceObject.update(data);
    } catch (error) {
      logMessage.accountErrorMessage('userDevice', { error, data });
      throw Error(error);
    }
  },

  /**
   * Add user device
   * @param {Object} data
   * @returns
   */
  async addUserDevice(data) {
    try {
      return await userDevice.create(data);
    } catch (error) {
      logMessage.accountErrorMessage('userDevice', { error, data });
      throw Error(error);
    }
  },

  /**
   * Get device detail by token
   * @param {String} token
   * @returns
   */
  async getDeviceDetailByToken(token) {
    try {
      const where = { token };
      return await userDevice.findOne({ where });
    } catch (error) {
      logMessage.accountErrorMessage('userDeviceToken', { error });
      throw Error(error);
    }
  },

  /**
   * Admin forgot password api
   * @param {Object} req
   * @returns
   */
  async adminForgotPassword(req) {
    try {
      const havingWhere = { email: req.body.email };
      const attributes = {};
      const userScope = [
        { method: ['user', { where: {}, havingWhere, attributes }] },
        { method: ['userRole', { whereRole: {} }] },
      ];
      const userResult = await user.scope(userScope).findOne();

      if (userResult && userResult.userRole.role.role === commonConstant.ROLE.ADMIN) {
        if (userResult.status === commonConstant.STATUS.ACTIVE) {
          req.forgotUser = userResult;
          const data = {
            to: userResult.email,
            firstName: `${userResult.firstName}`,
          };
          const result = await this.generatePasswordResetToken(req);
          data.token = result.passwordResetToken;
          return await Email.forgotPassword(data)
            .then(() => ({ status: 'sent' }))
            .catch((error) => ({ status: 'send_error', error }));
        }
        return { status: commonConstant.STATUS.INACTIVE };
      }
      return false;
    } catch (error) {
      logMessage.accountErrorMessage('forgotPassword', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Admin forgot password api
   * @param {Object} req
   * @returns
   */
  async resetAdminPassword(req) {
    try {
      const { token, newPassword } = req.body;
      const userResult = await userRepository.findOne({
        passwordResetToken: token,
      });
      if (userResult) {
        if (userResult) {
          await userRepository.updatePassword(userResult, newPassword);
          return { status: commonConstant.STATUS.UPDATED };
        }
        return { status: commonConstant.STATUS.INACTIVE };
      }
      return false;
    } catch (error) {
      logMessage.accountErrorMessage('resetPassword', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Reset password api
   * @param {Object} req
   * @returns
   */
  async resetPassword(req) {
    try {
      const {
        phoneNumberCountryCode, phoneNumber, otp, newPassword,
      } = req.body;
      const verificationOtp = otp;
      const userResult = await userRepository.findOne({
        phoneNumberCountryCode,
        phoneNumber,
        verificationOtp,
      });
      if (userResult) {
        if (userResult.status === commonConstant.STATUS.ACTIVE) {
          await userRepository.updatePassword(userResult, newPassword);
          return { status: commonConstant.STATUS.UPDATED };
        }
        return { status: commonConstant.STATUS.INACTIVE };
      }
      return false;
    } catch (error) {
      logMessage.accountErrorMessage('resetPassword', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Generate password reset token
   * @param {Object} req
   * @returns
   */
  async generatePasswordResetToken(req) {
    const { forgotUser } = req;
    try {
      const token = utility.generateRandomString(32);
      const userData = { passwordResetToken: token };
      await forgotUser.update(userData);
      return userData;
    } catch (error) {
      logMessage.accountErrorMessage('resetPasswordToken', { error });
      throw Error(error);
    }
  },

  /**
   * Add user device info
   * @param {Object} data
   * @returns
   */
  async addUserDeviceHistory(data) {
    try {
      return await userDevice.create(data);
    } catch (error) {
      logMessage.accountErrorMessage('userDeviceHistory', {
        error,
        data,
      });
      throw Error(error);
    }
  },

  /**
   * Account forgot password api
   * @param {Object} req
   * @returns
   */
  async accountForgotPassword(req) {
    try {
      const havingWhere = { email: req.body.email };
      const attributes = {};
      const userScope = [
        { method: ['user', { where: {}, havingWhere, attributes }] },
        { method: ['userRole', { whereRole: {} }] },
      ];
      const userResult = await user.scope(userScope).findOne();

      if (userResult && userResult.userRole.role.role !== commonConstant.ROLE.ADMIN) {
        if (userResult.status === commonConstant.STATUS.ACTIVE) {
          req.forgotUser = userResult;
          let data = {};
          data = {
            to: userResult.email,
            firstName: userResult.firstName,
          };

          const result = await this.generatePasswordResetToken(req);
          data.token = result.passwordResetToken;
          return await Email.forgotPassword(data)
            .then(() => ({ status: 'sent' }))
            .catch((error) => ({ status: 'send_error', error }));
        }
        return { status: commonConstant.STATUS.INACTIVE };
      }
      return false;
    } catch (error) {
      logMessage.accountErrorMessage('forgotPassword', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * update Profile Image
   * @param {Object} userDeviceObject
   * @param {Object} data
   * @returns
   */
  async updateProfileImage(req) {
    try {
      const bodyData = req.body;
      const where = { id: req.user.id };
      const userData = await user.findOne({ where });
      await mediaRepository.makeUsedMedias([bodyData.profileImage]);
      return await userData.update({ profileImage: bodyData.profileImage });
    } catch (error) {
      logMessage.accountErrorMessage('updateProfileImage', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Account verification otp send
   * @param {Object} req
   * @returns
   */
  async verificationOtpSend(req) {
    try {
      const { user: { id } } = req;
      const userScope = [
        { method: ['user', { where: { id } }] },
        { method: ['userRole', { whereRole: {} }] },
      ];
      const userResult = await user.scope(userScope).findOne();

      if (userResult && userResult.userRole.role.role !== commonConstant.ROLE.ADMIN) {
        if (userResult.status === commonConstant.STATUS.ACTIVE) {
          req.forgotUser = userResult;
          let data = {};
          data = {
            to: userResult.email,
            firstName: userResult.firstName,
          };
          const otp = utility.generateOtp();
          data.otp = otp;
          return await Email.otpSend(data)
            .then(async () => ({ status: 'sent', userResult: await userResult.update({ otp }) }))
            .catch((error) => ({ status: 'send_error', error }));
        }
        return { status: commonConstant.STATUS.INACTIVE };
      }
      return false;
    } catch (error) {
      logMessage.accountErrorMessage('otpSend', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * User account verify otp
   * @param {Object} req
   * @returns
   */
  async verificationOtpVerify(req) {
    try {
      const { user: { id }, body: { otp } } = req;
      const userResult = await userRepository.findOne({ id });
      if (userResult && userResult.userRole.role.role !== commonConstant.ROLE.ADMIN) {
        if (userResult.status === commonConstant.STATUS.ACTIVE) {
          if (userResult.otp === otp) {
            const userVerificationData = await userVerification.findOne(
              { where: { userId: id } },
            );
            if (userVerificationData && userVerificationData?.isEmailVerified === 0) {
              await userVerification.update(
                { isEmailVerified: 1 },
                { where: { userId: id } },
              );
            }
            if (!userVerificationData && userVerificationData?.isEmailVerified !== 0) {
              await userVerification.create({ userId: id, isEmailVerified: 1 });
            }
          } else {
            throw utility.customError(req, 'INVALID_OTP', 1);
          }
        } else {
          throw utility.customError(req, 'ACCOUNT_INACTIVE', 1);
        }
      }
    } catch (error) {
      logMessage.accountErrorMessage('otpVerify', { error });
      throw (error.errorCode) ? error : Error(error);
    }
  },

  /**
   * Get winston file list
   * @param {String} dirName
   * @returns
   */
  async getFileList(dirName) {
    const files = [];
    const items = fs.readdirSync(dirName, { withFileTypes: true });
    items.forEach(async (item) => {
      if (item.isDirectory()) {
        files.push(...(await this.getFileList(`${dirName}/${item.name}`)));
      } else {
        files.push(`${dirName}/${item.name}`);
      }
    });
    return files;
  },

  /**
   * Get log and count winston
   * @param {object} req
   * @returns
   */
  async getWinstonQuery(fileName, options) {
    try {
      winston.configure({
        transports: [new winston.transports.File({ filename: fileName })],
      });
      return new Promise((resolve, reject) => {
        winston.query(options, (error, results) => {
          if (error) {
            logMessage.accountErrorMessage('winstonQuery', { error, data: fileName });
            reject(error);
          }
          resolve(results);
        });
      });
    } catch (error) {
      logMessage.accountErrorMessage('winstonQuery', { error, data: fileName });
      throw Error(error);
    }
  },

  /**
   * Winston logs path
   * @returns
   */
  async getWinstonLogsPath() {
    try {
      const data = [];
      const logsPath = path.join(__dirname, '../logs');
      const items = await this.getFileList(logsPath);
      items.forEach((item) => {
        if (path.extname(item) === '.log') {
          data.push({
            key: item.split('logs/')[1],
            value: item.split('logs')[1],
          });
        }
      });
      return { rows: data.length > 0 ? data.reverse() : [], count: data.length };
    } catch (error) {
      logMessage.accountErrorMessage('logsPath', { error });
      throw Error(error);
    }
  },

  /**
   * Get log winston
   * @param {object} queryData
   * @returns
   */
  async getWinstonLogs(queryData) {
    try {
      const {
        fileName, limit, offset, order, startDate, endDate, level,
      } = queryData;
      const options = {
        order: order || 'DESC',
        // fields: ['timestamp']
      };
      const filePath = `${path.join(__dirname, '../logs')}${fileName}`;
      options.rows = 100000000;
      options.from = '2000-11-22';
      // Default log for yesterday and today show
      if (startDate) {
        options.from = startDate; // Date format 2013-08-11 00:00:00.000 accept
      }
      if (endDate) {
        options.until = endDate; // Date format 2013-08-11 00:00:00.000 accept
      }
      if (level) {
        options.level = level;
      }
      const count = await this.getWinstonQuery(filePath, options);
      options.limit = parseInt(limit, 10) || 10;
      options.start = parseInt(offset, 10) || 0;
      delete options.rows;
      const rows = await this.getWinstonQuery(filePath, options);
      return { rows: rows?.file, count: count?.file?.length ?? 0 };
    } catch (error) {
      logMessage.accountErrorMessage('logs', { error, data: queryData });
      throw Error(error);
    }
  },

  /**
   * Get level count
   * @param {object} req
   * @returns
   */
  async getWinstonLevelCount(queryData) {
    try {
      const { fileName } = queryData;
      const options = { rows: 100000000, from: '2000-11-22' };
      const filePath = `${path.join(__dirname, '../logs')}${fileName}`;
      const errorCount = await this.getWinstonQuery(filePath, {
        ...options,
        level: 'error',
      });
      const warnCount = await this.getWinstonQuery(filePath, {
        ...options,
        level: 'warn',
      });
      const infoCount = await this.getWinstonQuery(filePath, {
        ...options,
        level: 'info',
      });
      const httpCount = await this.getWinstonQuery(filePath, {
        ...options,
        level: 'http',
      });
      const verboseCount = await this.getWinstonQuery(filePath, {
        ...options,
        level: 'verbose',
      });
      const debugCount = await this.getWinstonQuery(filePath, {
        ...options,
        level: 'debug',
      });
      const sillyCount = await this.getWinstonQuery(filePath, {
        ...options,
        level: 'silly',
      });
      return {
        errorCount: errorCount?.file?.length ?? 0,
        warnCount: warnCount?.file?.length ?? 0,
        infoCount: infoCount?.file?.length ?? 0,
        httpCount: httpCount?.file?.length ?? 0,
        verboseCount: verboseCount?.file?.length ?? 0,
        debugCount: debugCount?.file?.length ?? 0,
        sillyCount: sillyCount?.file?.length ?? 0,
      };
    } catch (error) {
      logMessage.accountErrorMessage('logs', { error, data: queryData });
      throw Error(error);
    }
  },

};
