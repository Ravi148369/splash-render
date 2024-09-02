/* eslint-disable radix */
import { Op } from 'sequelize';
import models from '../models';
import logMessage from '../logMessages/index';
import stripeService from '../services/stripe-service';
import constant from '../constant';
import utility from '../services/utility';
import config from '../config';

const { bookingConstant, commonConstant } = constant;
const {
  userBankAccount,
  bookingPayment,
  country,
  state,
} = models;

export default {
  /**
   * Add bank account detail
   * @param {Object} req
   */
  async addBankAccount(req) {
    const transaction = await models.sequelize.transaction();
    try {
      const {
        body,
        user,
      } = req;
      body.userId = user.id;

      const {
        accountHolderName,
        accountNumber,
        routingNumber,
        bankName,
        email,
        bankLocation,
        dateOfBirth,
        addressLine1,
        city,
        stateId,
        postalCode,
        countryId,
        phone,
        ssn,
        taxClassification,
      } = body;

      const countryDetail = await country.findOne({ where: { id: countryId } });
      const countryCode = (countryDetail?.countryCode)
        ? countryDetail?.countryCode
        : commonConstant.COUNTRY.US;
      const stateDetail = await state.findOne({ where: { id: stateId } });
      const stateCode = (stateDetail?.stateCode) ? stateDetail?.stateCode : '';

      let stripeCustomerId = '';
      if (user?.stripeCustomerId) {
        stripeCustomerId = user?.stripeCustomerId;
      } else {
        const customerData = {
          name: user?.firstName,
          email: user?.email,
          description: `Customer - ${user?.firstName}`,
          address: {
            city: user?.userAddress?.city,
            country: countryCode,
            line1: user?.userAddress?.street,
          },
        };

        const customer = await stripeService.createCustomer(customerData);
        stripeCustomerId = customer?.id;
        await user.update({ stripeCustomerId }, { transaction });
      }

      const stripeAccountObject = {
        country: countryCode,
        currency: commonConstant.CURRENCY.USD,
        account_holder_name: accountHolderName,
        account_holder_type: 'individual',
        routing_number: routingNumber,
        account_number: accountNumber,
      };
      // delete account if already added
      const stripeBankResult = await stripeService.listBankAndCard(stripeCustomerId, 10);
      if (stripeBankResult && stripeBankResult?.data.length > 0) {
        const bankData = stripeBankResult?.data[0];
        if (
          bankData?.routing_number === routingNumber
          && bankData?.last4 === `${accountNumber}`.slice(-4)
        ) {
          if (bankData.id) {
            await stripeService.deleteBank(stripeCustomerId, bankData.id);
          }
        }
      }

      await stripeService.addBank(stripeCustomerId, stripeAccountObject);
      const { day, month, year } = utility.getDob(dateOfBirth);
      const stripeOwnerAccountObject = {
        email: user?.email,
        country: countryCode,
        business_type: 'individual',
        type: 'custom',
        external_account: {
          object: 'bank_account',
          country: countryCode,
          currency: commonConstant.CURRENCY.USD,
          account_holder_name: accountHolderName,
          account_holder_type: 'individual',
          routing_number: routingNumber,
          account_number: accountNumber,
        },
        individual: {
          email: user?.email,
          first_name: user?.firstName,
          last_name: user?.firstName,
          dob: {
            day,
            month,
            year,
          },
          address: {
            line1: addressLine1,
            city,
            state: stateCode,
            postal_code: postalCode,
            country: countryCode,
          },
          phone,
          ssn_last_4: ssn,
        },
        tos_acceptance: {
          date: new Date(),
          ip: req.headers.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        },
        business_profile: {
          mcc: '4457', // 4457 for boat_rentals_and_leases, check: https://stripe.com/docs/connect/setting-mcc
          url: config.app.adminUrl,
        },
        capabilities: {
          transfers: { requested: true },
          card_payments: { requested: true },
        },
      };

      const accountResult = await stripeService.storeAccountCreate(stripeOwnerAccountObject);
      let connectData = {};
      if (accountResult) {
        connectData = accountResult.accountSession;
        const userBankResult = await userBankAccount.findOne({
          where: { userId: user.id },
        });
        const userAccountDetail = {
          userId: user.id,
          accountHolderName,
          email,
          bankName,
          bankLocation,
          accountNumber,
          routingNumber,
          description: JSON.stringify(userBankResult),
          stripeAccountId: accountResult?.id,
          taxClassification,
        };
        if (userBankResult) {
          await userBankAccount.update(userAccountDetail, {
            where: { userId: user.id }, transaction,
          });
        } else {
          await userBankAccount.create(userAccountDetail, { transaction });
        }
        await transaction.commit();
      }
      const accountInfoData = await userBankAccount.findOne({
        where: { userId: user.id },
      });
      return { ...accountInfoData.dataValues, connectData };
    } catch (error) {
      await transaction.rollback();
      logMessage.bookingMessageErrorMessage('bankAccount', { error, data: req?.body });
      throw (error.errorCode) ? error : Error(error);
    }
  },

  /**
   * Get owner bank account
   * @param {object} req
   * @returns
   */
  async getBankAccount(req) {
    try {
      const {
        user,
      } = req;
      const userBankResult = await userBankAccount.findOne({
        where: { userId: user.id },
        order: [['id', 'DESC']],
      });
      return userBankResult;
    } catch (error) {
      logMessage.bookingMessageErrorMessage('bankAccountList', { error });
      throw Error(error);
    }
  },

  /**
   * transaction list for owner (received and pending amount deatil)
   * @param {object} req
   * @returns
   */
  async transactionList(req) {
    try {
      const {
        query: {
          limit, offset, status, scope, boatId,
        },
        user,
      } = req;
      const where = { Status: bookingConstant.STRIPE_PAYMENT_STATUS.SUCCEEDED };
      if (status === 'completed') {
        where.transferStatus = bookingConstant.STRIPE_PAYMENT_STATUS.TRANSFERRED;
      } else if (status === 'pending') {
        where.transferStatus = { [Op.ne]: bookingConstant.STRIPE_PAYMENT_STATUS.TRANSFERRED };
      }
      if (boatId) {
        where.boatId = boatId;
      }
      where.ownerId = user?.id;
      let searchCriteria = {
        where,
        order: [['id', 'DESC']],
      };
      if (scope !== 'all') {
        searchCriteria = {
          ...searchCriteria,
          limit: parseInt(limit || 10),
          offset: parseInt(offset || 0),
        };
      }
      const transactionList = [{ method: ['transactionList'] }];
      const result = await bookingPayment.scope(transactionList).findAndCountAll(searchCriteria);
      return result;
    } catch (error) {
      logMessage.bookingMessageErrorMessage('transactionList', { error });
      throw Error(error);
    }
  },

};
