import HttpStatus from "http-status";
import repositories from "../repositories";
import utility from "../services/utility";
import logger from "../services/logger";

const { salesTaxRepository } = repositories;

export default {
  /**
   * Add and Update Manage service fees in admin settings
   * @param {object} req
   * @param {object} res
   * @param {Function} next
   */
  async addSalesTax(req, res, next) {
    try {
      const result = await salesTaxRepository.addSalesTax(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, "SALES_TAX_CREATED"),
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get Service Fees
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async salesTaxList(req, res, next) {
    try {
      const result = await salesTaxRepository.salesTaxList(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, "SALES_TAX_DETAIL"),
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSalesTaxList(req, res, next) {
    try {
      const result = await salesTaxRepository.updateSalesTax(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result ?? {},
        message: utility.getMessage(req, false, "SALES_TAX_UPDATED"),
      });
    } catch (error) {
      next(error);
    }
  },

  async getSalesTax(req, res, next) {
    try {
      const result = await salesTaxRepository.getSalesTax(req);
      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: utility.getMessage(req, false, "SALES_TAX_DETAIL"),
      });
    } catch (error) {
      next(error);
    }
  },
};
