import HttpStatus from 'http-status';
import { Op } from 'sequelize';
import repositories from '../repositories';
import utility from '../services/utility';

const { blogRepository } = repositories;

export default {
  /**
   * Check duplicate Blog Exists
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async duplicateBlogExists(req, res, next) {
    try {
      const where = {};
      const { title } = req.body;
      if (req.params.id) {
        where.title = title;
        where.id = { [Op.ne]: req.params.id };
      } else {
        where.title = title;
      }
      const result = await blogRepository.getBlogDetails(where);
      if (result) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BLOG_EXIST'),
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check Blog exist
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkBlogExists(req, res, next) {
    try {
      const { id } = req.params;
      const result = await blogRepository.getBlogDetails({ id });
      if (result) {
        req.blogInfo = result;
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message: utility.getMessage(req, false, 'BLOG_NOT_FOUND'),
        });
      }
    } catch (error) {
      next(error);
    }
  },
};
