/* eslint-disable radix */
import { Op, Sequelize } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';
import notificationRepository from './notifications-repository';
import mediaRepository from './media-repository';
import utility from '../services/utility';
import Email from '../services/email';

const { userDocument, user } = models;

export default {
  /**
   * Add user document in user profile
   * @param {Object} req
   */
  async addUserDocument(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const { body } = req;
      const userData = req.user;
      body.userId = userData.id;
      await mediaRepository.makeUsedMedias([body.userDocument]);
      const userDocumentData = await userDocument.create(body, { transaction });
      const finalData = {
        userDocumentData,
        user: userData,
      };
      await transaction.commit();
      const notificationData = {
        toUserId: 1,
        fromUserId: userData.id,
        notificationsType: 'user_document_upload',
        message: await utility.getNotificationMessage(req, { type: 'USER_DOCUMENT_UPLOAD' }, finalData),
        customFields: userDocumentData ? JSON.stringify(userDocumentData) : null,
      };
      await notificationRepository.addUserNotification(notificationData);
      const admin = await user.findOne({ where: { id: 1 } });
      const message = await utility.getEmailMessage(req, { type: 'DOCUMENTS_RECEIVED_FOR_ADMIN' }, userData.dataValues)
      Email.documentsReceivedByAdmin({ ...admin.dataValues, message });
      return userDocumentData;
    } catch (error) {
      await transaction.rollback();
      logMessage.userDocumentErrorMessage('userDocumentAdd', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get list of user document for admin
   * @param {Object} req
   */
  async getUserDocuments(req) {
    try {
      const where = {};
      const queryData = req.query;
      let adminCriteria;
      let orderBy = [['createdAt', 'DESC']];
      if (req.userId) {
        const userData = req.user;
        where.userId = userData.id;
      }
      if (queryData.search) {
        const userNameConcat = Sequelize.fn(
          'CONCAT_WS',
          ' ',
          Sequelize.col('user.first_name'),
          Sequelize.col('user.last_name'),
        );
        const searchWhere = Sequelize.where(
          userNameConcat,
          'LIKE',
          `%${queryData.search}%`,
        );

        where[Op.and] = [searchWhere];
      }
      if (queryData.sortBy && queryData.sortType) {
        orderBy = [[queryData.sortBy, queryData.sortType]];
      }
      if (!req.userId) {
        adminCriteria = {
          include: [
            {
              model: user,
              attributes: ['first_name', 'last_name', 'email'],
              required: false,
            },
          ],
          limit: parseInt(queryData.limit || 10),
          offset: parseInt(queryData.offset || 0),
        };
      }
      return await userDocument.findAndCountAll({
        where,
        order: orderBy,
        ...adminCriteria,
      });
    } catch (error) {
      logMessage.userDocumentErrorMessage('userDocumentList', { error });
      throw Error(error);
    }
  },

  /**
   * Update user document Status
   * @param {object} req
   * @returns
   */
  async updateUserDocumentStatus(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const { params: { id }, body: { status } } = req;
      const where = { id };
      const userData = req?.user;
      const userDocumentData = await userDocument.findOne({ where });
      const userDocumentStatus = status;
      const updatedData = await userDocumentData.update(
        { status: userDocumentStatus },
        { transaction },
      );
      await transaction.commit();
      const finalData = {
        updatedData,
        user: userData,
      };
      const notificationData = {
        toUserId: userDocumentData?.userId,
        fromUserId: 1,
        notificationsType: 'user_document_upload_status',
        message: await utility.getNotificationMessage(req, { type: 'USER_DOCUMENT_UPLOAD_STATUS' }, finalData),
        customFields: userDocumentData ? JSON.stringify(userDocumentData) : null,
      };
      await notificationRepository.addUserNotification(notificationData);
      const customer = await user.findOne({ where: { id: userDocumentData?.userId } });
      const subject = status === "approve" ? "Document Approval Notification" : "Document Rejection  Notification"
      const message = await utility.getEmailMessage(req, { type: 'USER_DOCUMENT_STATUS' }, { ...customer.dataValues, status })
      Email.documentsApproved({ ...customer.dataValues, message, subject });
      return updatedData;
    } catch (error) {
      await transaction.rollback();
      logMessage.userDocumentErrorMessage('userDocumentUpdateStatus', {
        error,
        req,
      });
      throw Error(error);
    }
  },

  /**
   * Delete user document
   * @param {object} data
   * @returns
   */
  async deleteUserDocument(data) {
    try {
      const where = { id: data?.id };
      return await userDocument.destroy({ where });
    } catch (error) {
      logMessage.reviewErrorMessage('adminReviewDelete', {
        error,
        data,
      });
      throw Error(error);
    }
  },
};
