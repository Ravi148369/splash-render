import Stripe from 'stripe';
import config from '../config';
import logMessage from '../logMessages';

const axios = require('axios');

const stripe = new Stripe(config.stripe.secretKey);

export default {

  /**
   * Create stripe customer
   * @param {Object} data
   * @returns
   */
  async createCustomer(data) {
    try {
      const customer = await stripe.customers
        .create(data)
        .then((customerRes) => customerRes)
        .catch(() => false);
      logMessage.paymentMessage('customer', { customer, data });
      return customer;
    } catch (error) {
      logMessage.paymentErrorMessage('customer', { error, data });
      throw this.stripeCustomError(error, 1);
    }
  },

  /**
   * Create payment intent
   * @param {* amount , currency type} data
   * @returns
   */
  async createPaymentIntent(data) {
    try {
      const result = await stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency,
        description: data.description,
        customer: data.customer,
        payment_method_types: ['card'],
      });
      logMessage.paymentMessage('intent', { result, data });
      return result;
    } catch (error) {
      logMessage.paymentErrorMessage('intent', { error, data });
      throw this.stripeCustomError(error, 1);
    }
  },

  /**
   * Retrieve payment information
   * @param {Object} data
   * @returns
   */
  async RetrievePayment(data) {
    try {
      const retrieve = await stripe.paymentIntents.retrieve(data.payment_intent);
      logMessage.paymentMessage('retrievePayment', { retrieve, data });
      return retrieve;
    } catch (error) {
      logMessage.paymentErrorMessage('retrievePayment', { error, data });
      throw this.stripeCustomError(error, 1);
    }
  },

  /**
   * Create bank
   * @param {Number} stripeCustomerId
   * @param {Number} bankId
   * @returns
   */
  async addBank(stripeCustomerId, bankObject) {
    try {
      const customer = await this.retrieveCustomer(stripeCustomerId);
      if (!customer) {
        return false;
      }
      const token = await stripe.tokens.create({
        bank_account: bankObject,
      });
      const result = await stripe.customers.createSource(stripeCustomerId, {
        source: token.id,
      });
      logMessage.paymentMessage('addBank', { result, stripeCustomerId, bankId: result });
      return result;
    } catch (error) {
      logMessage.paymentErrorMessage('addBank', { error, stripeCustomerId });
      throw this.stripeCustomError(error, 1);
    }
  },

  /**
   * Retrieve stripe customer
   * @param {Object} data
   * @returns
   */
  async retrieveCustomer(data) {
    try {
      const result = await stripe.customers.retrieve(data);
      if (result) {
        logMessage.paymentMessage('customer', { result, data });
        return result;
      }
      return false;
    } catch (error) {
      logMessage.paymentErrorMessage('customerRetrieve', { error, data });
      throw this.stripeCustomError(error, 1);
    }
  },

  /**
   * Store business account create
   * @param {Number} stripeCustomerId
   * @param {Number} id
   * @returns
   */
  async storeAccountCreate(object) {
    try {
      const result = await stripe.accounts.create(object);
      let accountSession = {};
      if (result) {
        const data = {
          account: result?.id,
          components: {
            account_onboarding: {
              enabled: true,
              features: {
                external_account_collection: true,
              },
            },
          },
        };
        await axios.post(`https://api.stripe.com/v1/account_sessions?account=${result?.id}&components[account_onboarding][enabled]=true&components[account_onboarding][features][external_account_collection]=true`, data, {
          auth: {
            username: config.stripe.secretKey,
          },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }).then((res) => {
          accountSession = res.data;
          logMessage.paymentMessage('connectedAccount', { result: accountSession, object: { stripeConnectedAccountId: result?.id } });
          logMessage.paymentMessage('storeAccountCreate', { result, object });
        }).catch((err) => {
          logMessage.paymentErrorMessage('connectedAccount', { error: err.response.data, data: object });
        });
      }
      return { ...result, accountSession };
    } catch (error) {
      logMessage.paymentErrorMessage('storeAccountCreate', { error, data: object });
      throw this.stripeCustomError(error, 1);
    }
  },

  /**
   * Retrieve payment information
   * @param {Object} data
   * @returns
   */
  async refundAmount(paymentInfo) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentInfo.paymentIntentId,
        amount: Math.round(paymentInfo.refundAmount * 100),
      });
      logMessage.paymentMessage('refundAmount', { result: refund, data: paymentInfo });
      return refund;
    } catch (error) {
      logMessage.paymentErrorMessage('refundAmount', { error, data: paymentInfo });
      throw this.stripeCustomError(error, 1);
    }
  },

  /**
   * Create transfers
   * @param {Object} data
   * @returns
   */
  async createTransfers(transferInfo) {
    try {
      let result;
      const account = await stripe.accounts.retrieve(transferInfo?.destination);
      if (account && account.capabilities.transfers === 'active') {
        logMessage.paymentMessage('createTransfers', { result: account, data: transferInfo });
        result = await stripe.transfers.create(transferInfo);
      } else {
        result = false;
      }
      return result;
    } catch (error) {
      logMessage.paymentErrorMessage('createTransfers', { error, data: transferInfo });
      throw this.stripeCustomError(error, 1);
    }
  },

  /**
   * Stripe custom Error
   * @param {string} error
   * @param {number} errorCode
   * @returns
   */
  stripeCustomError(error, errorCode) {
    return Object.assign(Error(error), { errorCode });
  },

  /**
   * List all bank accounts (listType = bank_account pass ) and
   * card (listType = card pass)
   * @param {Number} stripeCustomerId
   * @param {Number} limit
   * @returns
   */
  async listBankAndCard(stripeCustomerId, limit, listType = 'bank_account') {
    try {
      const customer = await this.retrieveCustomer(stripeCustomerId);
      if (!customer) {
        return false;
      }
      const result = await stripe.customers.listSources(stripeCustomerId, {
        object: listType,
        limit: parseInt(limit, 10) ?? 3,
      });
      return result;
    } catch (error) {
      logMessage.paymentErrorMessage('listBankAccount', { error });
      throw this.stripeCustomError(error, 1);
    }
  },

  /**
   * Delete bank
   * @param {Number} stripeCustomerId
   * @param {Number} bankId
   * @returns
   */
  async deleteBank(stripeCustomerId, bankId) {
    try {
      const customer = await this.retrieveCustomer(stripeCustomerId);
      if (!customer) {
        return false;
      }
      const result = await stripe.customers.deleteSource(
        stripeCustomerId,
        bankId,
      );
      return result;
    } catch (error) {
      logMessage.paymentErrorMessage('deleteBankAccount', { error });
      throw this.stripeCustomError(error, 1);
    }
  },

};
