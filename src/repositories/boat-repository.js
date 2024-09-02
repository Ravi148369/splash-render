/* eslint-disable array-callback-return */
/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages';
import mediaRepository from './media-repository';
import notificationRepository from './notifications-repository';
import subQuery from '../helpers';
import utility from '../services/utility';
import constant from '../constant';
import Email from '../services/email';

const { commonConstant, boatConstant } = constant;
const {
  user: userModel, boat, boatFeatureList, boatImage, boatRuleList, boatPrice,
  boatBlockDate, booking, bookingPayment,
} = models;
export default {
  /**
   * createBoat
   * @param {Object} req
   * @returns
   */
  async createBoat(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const {
        body: { boatFeatureIds },
        user,
      } = req;
      const reqData = req.body;
      reqData.ownerId = user.id;
      const featureIds = boatFeatureIds;
      const featureData = [];
      const boatData = await boat.create(reqData, { transaction });
      featureIds.map((item) => {
        featureData.push({
          boatId: boatData.id,
          featureId: item,
        });
      });
      if (featureData && featureData.length > 0) {
        await boatFeatureList.bulkCreate(featureData, { transaction });
      }
      await transaction.commit();
      return boatData;
    } catch (error) {
      await transaction.rollback();
      logMessage.boatErrorMessage('boatAdd', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Update Boat
   * @param {Object} req
   */
  async updateBoat(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const {
        params: { id },
        body: { boatFeatureIds },
      } = req;
      await boat.update(req.body, { where: { id } });
      const featureIds = boatFeatureIds;
      const featureData = [];
      featureIds.map((item) => {
        featureData.push({
          boatId: id,
          featureId: item,
        });
      });
      await boatFeatureList.destroy({ where: { boatId: id }, transaction });
      if (featureData && featureData.length > 0) {
        await boatFeatureList.bulkCreate(featureData, { transaction });
      }
      await transaction.commit();
      return await this.findOne({ id });
    } catch (error) {
      await transaction.rollback();
      logMessage.boatErrorMessage('updateBoat', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * addBoatImages
   * @param {Object} req
   * @returns
   */
  async addBoatImages(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const {
        body: { boatImages },
        boatInfo,
      } = req;
      const boatImagesPaths = boatImages;
      const boatImagesData = [];
      const boatImageLinks = [];
      const boatData = await boatInfo.update(req.body, { transaction });
      boatImagesPaths.map((item) => {
        boatImageLinks.push(item.image);
        boatImagesData.push({
          boatId: boatData.id,
          image: item.image,
          coverImage: item.cover_image,
        });
      });
      await boatImage.destroy({ where: { boatId: boatData.id }, transaction });
      if (boatImagesData && boatImagesData.length > 0) {
        await mediaRepository.makeUsedMedias(boatImageLinks, transaction);
        await boatImage.bulkCreate(boatImagesData, { transaction });
      }
      await transaction.commit();
      return await this.findOne({ id: boatData.id });
    } catch (error) {
      await transaction.rollback();
      logMessage.boatErrorMessage('boatImagesAdd', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * add Boat Detail
   * @param {Object} req
   * @returns
   */
  async addBoatDetail(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const {
        body: {
          boatRuleIds, boatPrices, boatBlockDates, currency,
        },
        boatInfo,
        user
      } = req;
      const reqData = req.body;
      const boatRulesData = [];
      const boatPricesData = [];
      const boatBlockDateData = [];
      const boatData = await boatInfo.update(reqData, { transaction });

      await boatRuleIds.map((item) => {
        boatRulesData.push({
          boatId: boatData.id,
          ruleId: item,
        });
      });

      await boatPrices.map((item) => {
        if (item.amount !== undefined && item.amount !== 0) {
          boatPricesData.push({
            boatId: boatData.id,
            duration: item.duration,
            amount: item.amount,
            currency,
          });
        }
      });

      await boatRuleList.destroy({
        where: { boatId: boatData.id },
        transaction,
      });
      if (boatRulesData && boatRulesData.length > 0) {
        await boatRuleList.bulkCreate(boatRulesData, { transaction });
      }

      await boatPrice.destroy({ where: { boatId: boatData.id }, transaction });
      if (boatPricesData && boatPricesData.length > 0) {
        await boatPrice.bulkCreate(boatPricesData, { transaction });
      }

      await boatBlockDates.map((item) => {
        boatBlockDateData.push({
          boatId: boatData.id,
          date: item,
        });
      });

      await boatBlockDate.destroy({
        where: { boatId: boatData.id },
        transaction,
      });
      if (boatBlockDateData && boatBlockDateData.length > 0) {
        await boatBlockDate.bulkCreate(boatBlockDateData, { transaction });
      }
      await transaction.commit();
      const findBoatData = await this.findOne({ id: boatData.id });
      const notificationData = {
        toUserId: 1,
        fromUserId: boatInfo.ownerId,
        notificationsType: 'new_boat_added',
        message: await utility.getNotificationMessage(req, { type: 'NEW_BOAT_ADDED' }, findBoatData),
        customFields: findBoatData ? JSON.stringify(findBoatData) : null,
      };
      await notificationRepository.addUserNotification(notificationData);
      const admin = await userModel.findOne({ where: { id: 1 } });
      Email.boatsListedForApproval({ email: admin.email, owner: user.firstName })
      return findBoatData;
    } catch (error) {
      await transaction.rollback();
      logMessage.boatErrorMessage('boatDetailsAdd', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Find boat
   * @param {Object} where
   */
  async findOne(where) {
    try {
      const boatDetail = [{ method: ['boatDetail'] }];
      const searchCriteria = {
        where,
      };
      return await boat.scope(boatDetail).findOne(searchCriteria);
    } catch (error) {
      logMessage.boatErrorMessage('boatDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Boat list
   * @param {object} req
   * @returns
   */
  async getBoatList(req) {
    try {
      const {
        query: {
          limit, offset, name, status, scope,
          isRecommended, latitude, longitude, boatTypeId, fromDate,
        },
        user,
      } = req;
      let where = {};
      if (name) {
        where.name = { [Op.like]: `%${name}%` };
      }
      where.status = boatConstant.BOAT_STATUS.COMPLETED;
      where.liveStatus = boatConstant.BOAT_LIVE_STATUS.LISTED;
      if (scope === 'manageBoat') {
        delete where.liveStatus;
        if (user && user.userRole?.role?.dataValues?.role === commonConstant.ROLE.ADMIN) {
          where.status = boatConstant.BOAT_STATUS.COMPLETED;
        } else {
          if (status) {
            where.status = status;
          }
          where.ownerId = user.id;
        }
      }
      if (isRecommended === 'true') {
        where.isRecommended = 1;
      }
      if (latitude && longitude) {
        where.id = subQuery.getBoatByLocation(latitude, longitude);
      }
      if (boatTypeId) {
        where.typeId = boatTypeId;
      }
      if (fromDate) {
        const startDate = utility.convertFormat(fromDate);
        const blockId = [];
        await boatBlockDate.findAll({
          where: {
            date: startDate,
          },
        }).then((result) => {
          result.map((r) => {
            blockId.push(r.boatId);
          });
        });
        where = {
          [Op.and]: [
            where,
            {
              [Op.and]: [
                {
                  id: { [Op.notIn]: blockId },
                },
              ],
            },
          ],
        };
      }

      let searchCriteria = {
        where,
        order: [['id', 'DESC']],
      };
      const boatList = [{ method: ['boatList'] }];
      const rowCount = await boat.scope(boatList).findAll(searchCriteria);
      if (scope !== 'manageBoat') {
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      const boatResult = await boat.scope(boatList).findAll(searchCriteria);
      const result = [];
      if (boatResult.length > 0) {
        await Promise.all(
          boatResult.map(async (item) => {
            const objectValue = item;
            objectValue.dataValues.lowestPrice = await this.getLowestPrise(item.id);
            result.push(objectValue);
          }),
        );
      }
      const data = {
        count: rowCount.length,
        rows: result,
      };
      return data;
    } catch (error) {
      logMessage.boatErrorMessage('boatList', { error, data: req?.body });
      throw Error(error);
    }
  },

  async getLowestPrise(id) {
    try {
      const price = {};
      price.boatId = id;
      const searchLowestPrice = {
        where: price,
        order: [['amount', 'ASC']],
      };
      const lowestPrice = await boatPrice.findOne(searchLowestPrice);
      let data = {};
      if (lowestPrice) {
        data = {
          amount: (lowestPrice?.amount) ? lowestPrice?.amount : '',
          currency: (lowestPrice?.currency) ? lowestPrice?.currency : '',
        };
      }
      return data;
    } catch (error) {
      logMessage.boatErrorMessage('boatList', { error, id });
      throw Error(error);
    }
  },

  /**
   * Update Boat Status
   * @param {object} req
   * @returns
   */
  async updateBoatStatus(req) {
    try {
      const {
        params: { id },
        body: { status },
        boatInfo: { owner }
      } = req;
      const boatData = await boat.findOne({ where: { id } });
      await boatData.update({ liveStatus: status });
      let message = {};
      const emailData = { ...owner.dataValues }
      if (status === boatConstant.BOAT_LIVE_STATUS.LISTED) {
        message = await utility.getNotificationMessage(req, { type: 'BOAT_LISTED' }, boatData);
        emailData.message = await utility.getEmailMessage(req, { type: 'BOAT_LISTED_FOR_OWNER' }, boatData)
        emailData.subject = "Boat Approval Notification"
      }
      if (status === boatConstant.BOAT_LIVE_STATUS.UNLISTED) {
        message = await utility.getNotificationMessage(req, { type: 'BOAT_UNLISTED' }, boatData);
        emailData.message = await utility.getEmailMessage(req, { type: 'BOAT_UNLISTED_FOR_OWNER' }, boatData)
        emailData.subject = "Boat Rejection Notification"
      }
      Email.boatApproved(emailData)
      const notificationData = {
        toUserId: boatData.ownerId,
        fromUserId: 1,
        notificationsType: 'boat_status_updated',
        message,
        customFields: boatData ? JSON.stringify(boatData) : null,
      };
      await notificationRepository.addUserNotification(notificationData);

      return boatData;
    } catch (error) {
      logMessage.boatErrorMessage('boatUpdateStatus', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Boat Recommend
   * @param {object} data
   * @returns
   */
  async boatRecommend(data) {
    try {
      const { id, isRecommended } = data;
      const boatData = await boat.findOne({ where: { id } });
      return await boatData.update({ isRecommended });
    } catch (error) {
      logMessage.boatErrorMessage('boatUpdateStatus', { error, data });
      throw Error(error);
    }
  },

  /**
   * Boat Booking Active and Inactive by admin
   * @param {object} data
   * @returns
   */
  async boatIsBookingStatus(data) {
    try {
      const { id, isBooking } = data;
      return await boat.update({ isBooking }, { where: { id } });
    } catch (error) {
      logMessage.boatErrorMessage('boatUpdateStatus', { error, data });
      throw Error(error);
    }
  },

  /**
   * Check boat blocked status for given date
   * @param {number} boatId
   * @param {date} date
   * @returns
   */
  async getBoatBlockedDateStatus(boatId, date) {
    try {
      const searchCriteria = {
        boatId,
        date,
      };
      const blockedStatus = await boatBlockDate.findOne({ where: searchCriteria });
      return blockedStatus;
    } catch (error) {
      logMessage.boatErrorMessage('boatBlockStatus', { error, boatId });
      throw Error(error);
    }
  },

  /**
   * Check Boat already booked
   * @param {object} data
   * @returns
   */
  async checkBookedSlot(data, bookingId) {
    try {
      const {
        boatId, bookingDate, startTime, endTime,
      } = data;
      let where = {};
      where.boatId = boatId;
      where.bookingDate = bookingDate;
      where.status = { [Op.in]: ['pending', 'completed'] };
      if (bookingId) {
        where.id = { [Op.not]: bookingId };
      }
      where = {
        [Op.and]: [
          where,
          {
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    [Op.and]: [
                      {
                        startTime: {
                          [Op.lt]: startTime,
                        },
                      },
                      {
                        endTime: {
                          [Op.gt]: startTime,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        startTime: {
                          [Op.lt]: endTime,
                        },
                      },
                      {
                        endTime: {
                          [Op.gt]: endTime,
                        },
                      },
                    ],
                  },
                  {
                    [Op.and]: [
                      {
                        startTime: {
                          [Op.gte]: startTime,
                        },
                      },
                      {
                        endTime: {
                          [Op.lte]: endTime,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };
      const bookingDetail = await booking.findOne({ where });
      return bookingDetail;
    } catch (error) {
      logMessage.boatErrorMessage('checkBookedSlot', { error, data });
      throw Error(error);
    }
  },

  /**
   * Get boat booking transaction list
   * @param {object} req
   * @returns
   */
  async getBoatBookingTransaction(req) {
    try {
      const {
        query: {
          limit, offset, search,
        },
      } = req;
      const where = {};
      if (search) {
        where['$boat.name$'] = { [Op.like]: `%${search}%` };
      }
      const transaction = [{ method: ['transaction'] }];
      const transactionList = await bookingPayment.scope(transaction).findAll({ where });
      const transactionListData = await bookingPayment.scope(transaction).findAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit || 10),
        offset: parseInt(offset || 0),
      });

      const data = {
        count: transactionList?.length,
        rows: transactionListData,
      };
      return data;
    } catch (error) {
      logMessage.boatErrorMessage('boatBookingTransaction', { error });
      throw Error(error);
    }
  },

  /**
   * Delete Boat
   * @param {Object} req
   */
  async deleteBoat(req) {
    try {
      const { params: { id } } = req;
      return await boat.destroy({ where: { id } });
    } catch (error) {
      logMessage.boatErrorMessage('deleteBoat', { error });
      throw Error(error);
    }
  },
};
