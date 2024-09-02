import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { userDocumentRepository } = repositories;

export default {
  /**
   * Add User Document in User Profile
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addUserDocument(req, res, next) {
    try {
      const result = await userDocumentRepository.addUserDocument(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'USER_DOCUMENT_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user document list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getUserDocuments(req, res, next) {
    try {
      const userData = req.user;
      req.userId = userData.id;
      const result = await userDocumentRepository.getUserDocuments(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: '',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user document list for admin
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getUserDocumentsForAdmin(req, res, next) {
    try {
      const result = await userDocumentRepository.getUserDocuments(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: '',
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update userDocument Status
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateUserDocumentStatus(req, res, next) {
    try {
      await userDocumentRepository.updateUserDocumentStatus(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: [],
        message: utility.getMessage(req, false, 'USER_DOCUMENT_STATUS_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete user document
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async deleteUserDocument(req, res, next) {
    try {
      const { params: { id } } = req;
      await userDocumentRepository.deleteUserDocument({ id });
      res.status(HttpStatus.OK).json({
        success: true,
        data: [],
        message: utility.getMessage(req, false, 'USER_DOCUMENT_DELETED'),
      });
    } catch (error) {
      next(error);
    }
  },
};
