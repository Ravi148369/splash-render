/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';
import mediaRepository from './media-repository';

const { blog } = models;

export default {
  /**
   * Add Blog in home page settings
   * @param {Object} req
   */
  async addBlog(req) {
    try {
      const { body } = req;
      await mediaRepository.makeUsedMedias([body.blogImage]);
      return await blog.create(body);
    } catch (error) {
      logMessage.blogErrorMessage('blogAdd', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Get specific blog
   * @param {Object} where
   */
  async getBlogDetails(where) {
    try {
      return await blog.findOne({
        where,
      });
    } catch (error) {
      logMessage.blogErrorMessage('blogDetails', { error });
      throw Error(error);
    }
  },

  /**
   * Get list of blog
   * @param {Object} req
   */
  async getBlogs(req) {
    try {
      const {
        query: {
          search, sortBy, sortType, limit, offset,
        },
      } = req;
      const where = {};
      let orderBy = [['createdAt', 'DESC']];
      const sortFields = ['id', 'title', 'url'];
      if (search) {
        where.title = { [Op.like]: `%${search}%` };
      }
      if (
        sortBy
        && sortType
        && sortFields.includes(sortBy)
      ) {
        orderBy = [[sortBy, sortType]];
      }
      return await blog.findAndCountAll({
        where,
        order: orderBy,
        limit: parseInt(limit || 10),
        offset: parseInt(offset || 0),
      });
    } catch (error) {
      logMessage.blogErrorMessage('blogList', { error });
      throw Error(error);
    }
  },

  /**
   * Update Blog
   * @param {Object} req
   */
  async updateBlog(req) {
    try {
      const { body } = req;
      const { id } = req.params;
      await mediaRepository.makeUsedMedias([body.blogImage]);
      return await blog.update(body, { where: { id } });
    } catch (error) {
      logMessage.blogErrorMessage('blogUpdate', { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Update Blog Status
   * @param {object} data
   * @returns
   */
  async updateBlogStatus(data) {
    try {
      const where = { id: data.id };
      const blogData = await blog.findOne({ where });
      const blogStatus = data.status;
      return await blogData.update({ status: blogStatus });
    } catch (error) {
      logMessage.blogErrorMessage('blogUpdateStatus', { error, data });
      throw Error(error);
    }
  },

  /**
   * Delete Blog
   * @param {Object} req
   */
  async deleteBlog(req) {
    try {
      const { params: { id } } = req;
      return await blog.destroy({ where: { id } });
    } catch (error) {
      logMessage.blogErrorMessage('blogDelete', { error });
      throw Error(error);
    }
  },
};
