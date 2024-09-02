/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';
import constant from '../constant';
import utility from '../services/utility';
import notificationRepository from './notifications-repository';

const { commonConstant } = constant;

const { review } = models;

export default {
  /**
   * Add Admin Review in admin settings
   * @param {Object} req
   */
  async addAdminReview(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const { body: { boatId, content }, user, boatInfo } = req;
      const adminReviewData = {
        boatId,
        content,
        ownerId: boatInfo?.ownerId,
        userId: user.id,
      };
      const reviewData = await review.create(adminReviewData, { transaction });
      await transaction.commit();
      const finalNotificationData = {
        reviewData,
        boatInfo,
      };
      const notificationData = {
        toUserId: boatInfo?.ownerId,
        fromUserId: 1,
        notificationsType: 'review',
        message: await utility.getNotificationMessage(req, { type: 'REVIEW' }, finalNotificationData),
        customFields: reviewData ? JSON.stringify(reviewData) : null,
      };
      await notificationRepository.addUserNotification(notificationData);
      return reviewData;
    } catch (error) {
      await transaction.rollback();
      logMessage.reviewErrorMessage('adminReviewAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Add User Review On Boat
   * @param {Object} req
   */
  async addUserReview(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const { body: { boatId, bookingId, content }, user, boatInfo } = req;
      const reviewData = {
        boatId,
        content,
        userId: user.id,
        ownerId: boatInfo?.ownerId,
        bookingId: bookingId ?? null,
      };
      const userReviewData = await review.create(reviewData, { transaction });
      await transaction.commit();
      const finalNotificationData = {
        userReviewData,
        boatInfo,
      };
      const notificationData = {
        toUserId: boatInfo?.ownerId,
        fromUserId: user.id,
        notificationsType: 'review',
        message: await utility.getNotificationMessage(req, { type: 'REVIEW' }, finalNotificationData),
        customFields: reviewData ? JSON.stringify(reviewData) : null,
      };
      await notificationRepository.addUserNotification(notificationData);
      return reviewData;
    } catch (error) {
      await transaction.rollback();
      logMessage.reviewErrorMessage('reviewAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get specific Admin Review
   * @param {Object} where
   */
  async getAdminReviewDetails(where) {
    try {
      return await review.findOne({
        where,
      });
    } catch (error) {
      logMessage.reviewErrorMessage('adminReviewDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Get list of Admin Review
   * @param {Object} req
   */
  async getAdminReviews(req) {
    try {
      const {
        query: {
          search, sortBy, sortType, limit, offset,
        },
      } = req;
      const where = {};
      let orderBy = [['createdAt', 'DESC']];
      if (search) {
        where['$boat.name$'] = { [Op.like]: `%${search}%` };
      }
      if (sortBy && sortType) {
        orderBy = [[sortBy, sortType]];
      }
      const boatDetail = [{ method: ['boatDetail'] }];
      const reviewList = await review.scope(boatDetail).findAll({ where });
      const reviewData = await review.scope(boatDetail).findAndCountAll({
        where,
        order: orderBy,
        limit: parseInt(limit || 10),
        offset: parseInt(offset || 0),
      });
      const data = {
        count: reviewList.length,
        rows: reviewData.rows,
      };
      return data;
    } catch (error) {
      logMessage.reviewErrorMessage('adminReviewList', { error });
      throw Error(error);
    }
  },

  /**
   * Get list of user Review and boat review
   * @param {Object} req
   */
  async getUserAndBoatReviews(req) {
    try {
      const {
        query: {
          sortBy, sortType, limit, offset, boatId,
        },
        user,
      } = req;
      const where = { status: commonConstant.STATUS.ACTIVE };
      let orderBy = [['createdAt', 'DESC']];
      if (boatId) {
        where.boatId = boatId;
      } else {
        where.ownerId = user.id;
      }
      if (sortBy && sortType) {
        orderBy = [[sortBy, sortType]];
      }
      const boatDetail = [{ method: ['boatDetail'] }];
      const reviewList = await review.scope(boatDetail).findAll({ where });
      const reviewData = await review.scope(boatDetail).findAndCountAll({
        where,
        order: orderBy,
        limit: parseInt(limit || 10),
        offset: parseInt(offset || 0),
      });
      const data = {
        count: reviewList.length,
        rows: reviewData.rows,
      };
      return data;
    } catch (error) {
      logMessage.reviewErrorMessage('reviewList', { error });
      throw Error(error);
    }
  },

  /**
   * Update Admin Review
   * @param {Object} req
   */
  async updateAdminReview(req) {
    try {
      const { body, params: { id } } = req;
      return await review.update(body, { where: { id } });
    } catch (error) {
      logMessage.reviewErrorMessage('adminReviewUpdate', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Update Admin Review status
   * @param {Object} req
   */
  async updateAdminReviewStatus(req) {
    try {
      const { body, params: { id } } = req;
      return await review.update(body, { where: { id } });
    } catch (error) {
      logMessage.reviewErrorMessage('adminReviewUpdateStatus', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Delete Admin Review
   * @param {object} data
   * @returns
   */
  async deleteAdminReview(data) {
    try {
      const where = { id: data?.id };
      return await review.destroy({ where });
    } catch (error) {
      logMessage.reviewErrorMessage('adminReviewDelete', {
        error,
        data,
      });
      throw Error(error);
    }
  },
};
