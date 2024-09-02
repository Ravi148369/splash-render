import HttpStatus from 'http-status';
import repositories from '../repositories';
import utility from '../services/utility';

const { blogRepository } = repositories;

export default {
  /**
   * Add Blog in home page settings
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async addBlog(req, res, next) {
    try {
      const result = await blogRepository.addBlog(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BLOG_CREATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Blog list
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async getBlogs(req, res, next) {
    try {
      const result = await blogRepository.getBlogs(req);
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
   * get blog Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async getBlogDetail(req, res, next) {
    try {
      const result = req.blogInfo ?? {};
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, 'BLOG_DETAIL'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update blog Detail
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateBlog(req, res, next) {
    try {
      const result = await blogRepository.updateBlog(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BLOG_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update Blog Status
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async updateBlogStatus(req, res, next) {
    try {
      const bodyData = {
        id: req.params.id,
        status: req.body.status,
      };
      await blogRepository.updateBlogStatus(bodyData);
      res.status(HttpStatus.OK).json({
        success: true,
        data: [],
        message: utility.getMessage(req, false, 'BLOG_STATUS_UPDATED'),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete Blog
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async deleteBlog(req, res, next) {
    try {
      const result = await blogRepository.deleteBlog(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, 'BLOG_DELETE'),
      });
    } catch (error) {
      next(error);
    }
  },
};
