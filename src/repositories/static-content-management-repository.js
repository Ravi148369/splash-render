import models from '../models';
import logMessage from '../logMessages/index';
import mediaRepository from './media-repository';

const { staticContentManagement, banner, footerBlock } = models;

export default {
  /**
   * Get one Static Content Page
   * @param {Object} where
   */
  async getStaticPageDetails(where) {
    try {
      return await staticContentManagement.findOne({
        where,
      });
    } catch (error) {
      logMessage.staticContentErrorMessage('staticContentDetails', {
        error,
      });
      throw Error(error);
    }
  },

  /**
   * Get bulk Static Content Pages
   * @param {Object} req
   */
  async getStaticContentPages(req) {
    try {
      const where = {};
      return await staticContentManagement.findAndCountAll({
        where,
      });
    } catch (error) {
      logMessage.staticContentErrorMessage('staticContentList', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Update Static Content Pages
   * @param {Object} req
   */
  async updateStaticContentPages(req) {
    try {
      const { body } = req;
      const { id } = req.params;
      return await staticContentManagement.update(body, { where: { id } });
    } catch (error) {
      logMessage.staticContentErrorMessage('staticContentUpdate', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Add banner image and home page content in home page settings
   * @param {Object} req
   */
  async addBannerImageAndPageContent(req) {
    try {
      const { body } = req;
      await mediaRepository.makeUsedMedias([body.bannerImage]);
      const where = { type: body.type };
      const result = await banner.findOne({
        where,
      });
      if (!result) {
        return await banner.create(body);
      }
      return await banner.update(body, {
        where: { id: result.dataValues?.id },
      });
    } catch (error) {
      logMessage.staticContentErrorMessage('bannerAndPageContent', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get banner and home page content
   * @param {Object} where
   */
  async getBannerImageAndPageContent(req) {
    try {
      const queryData = req.query;
      const where = {};
      if (queryData.type) {
        where.type = queryData.type;
      }
      return await banner.findOne({
        where,
      });
    } catch (error) {
      logMessage.staticContentErrorMessage('bannerAndPageContentDetails', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Add Footer block content in home page settings
   * @param {Object} req
   */
  async addFooterBlockContent(req) {
    try {
      const { body } = req;
      const result = await footerBlock.findOne({
      });
      if (!result) {
        return await footerBlock.create(body);
      }
      return await footerBlock.update(body, {
        where: { id: result.dataValues?.id },
      });
    } catch (error) {
      logMessage.staticContentErrorMessage('footerBlock', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get Footer block content
   * @param {Object} where
   */
  async getFooterBlockContent(req) {
    try {
      const where = {};
      return await footerBlock.findOne({
        where,
      });
    } catch (error) {
      logMessage.staticContentErrorMessage('footerBlockDetails', {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },
};
