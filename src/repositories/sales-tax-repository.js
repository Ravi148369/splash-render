import models from "../models";
import logMessage from "../logMessages";

const { salesTax: salesTaxModal } = models;

export default {
  /**
   * Add and Update Manage service fees in admin settings
   * @param {Object} req
   */
  async addSalesTax(req) {
    try {
      const { body } = req;
      return await salesTaxModal.create(body);
    } catch (error) {
      logMessage.salesTaxErrorMessage("salesTaxAdd", {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get Service Fees
   * @param {Object} req
   */
  async salesTaxList(req) {
    try {
      const {
        query: {
          limit,
          offset,
          zipCode,
          salesTax,
          search,
          sortBy,
          sortType,
          scope,
        },
      } = req;
      const sortFields = ["zipCode", "salesTax"];
      let orderBy = [["id", "DESC"]];
      const where = {};
      if (zipCode) {
        where.zipCode = zipCode;
      }
      if (salesTax) {
        where.salesTax = salesTax;
      }

      if (search) {
        where[Op.or] = [
          { zipCode: { [Op.like]: `%${search}%` } },
          { salesTax: { [Op.like]: `%${search}%` } },
        ];
      }
      if (sortBy && sortType && sortFields.includes(sortBy)) {
        switch (sortBy) {
          case "zipCode":
            orderBy = [[{ model: salesTaxModal }, "zipCode", sortType]];
            break;
          case "salesTax":
            orderBy = [["salesTax", sortType]];
            break;
          default:
            orderBy = [[sortBy, sortType]];
            break;
        }
      }
      let searchCriteria = {
        where,
        order: orderBy,
      };
      if (scope !== "all") {
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      const result = await salesTaxModal.findAndCountAll(searchCriteria);
      return result;
    } catch (error) {
      logMessage.salesTaxErrorMessage("salesTaxList", { error, data: req?.body });
      throw Error(error);
    }
  },

  /**
   * Get Service Fees
   * @param {Object} req
   */
  async updateSalesTax(req) {
    try {
      const { body } = req;
      const { id, ...data } = body;
      return await salesTaxModal.update(data, {
        where: {
          id,
        },
      });
    } catch (error) {
      logMessage.salesTaxErrorMessage("salesTaxUpdate", {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },

  /**
   * Get Service Fees
   * @param {Object} req
   */
  async getSalesTax(req) {
    try {
      const {
        query: { zipCode },
      } = req;
      return await salesTaxModal.findOne({
        where: {
          zipCode,
        },
      });
    } catch (error) {
      logMessage.salesTaxErrorMessage("salesTaxList", {
        error,
        data: req?.body,
      });
      throw Error(error);
    }
  },
};
