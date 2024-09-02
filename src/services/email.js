import emailer from './base-emailer';
import config from '../config';
import ejsTemplate from './ejs';
import loggers from './logger';
import utility from './utility';

export default {
  /**
   * Send email on forgot password
   * @param {Object} data
   */
  async forgotPassword(param) {
    try {
      const { adminUrl } = config.app;
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      data.redirect_url = `${adminUrl}reset-password/${data.token}`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'forgot-password.ejs',
        data,
      });
      const options = {
        to: data.to,
        subject: utility.getMessage({}, false, 'PASSWORD_CHANGE_SUBJECT'),
        message: result,
      };
      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
   * Send email for verification with otp
   * @param {Object} data
   */
  async otpSend(param) {
    try {
      const { adminUrl } = config.app;
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      data.redirect_url = `${adminUrl}otp-verification`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'user-account-verification.ejs',
        data,
      });
      const options = {
        to: data.to,
        subject: utility.getMessage({}, false, 'OTP_SEND'),
        message: result,
      };
      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
   * Send email for verification with otp
   * @param {Object} data
   */
  async contactAndSupport(param) {
    try {
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'support.ejs',
        data,
      });
      const options = {
        to: data.to,
        subject: utility.getMessage({}, false, 'CONTACT_AND_SUPPORT'),
        message: result,
      };
      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
   * Send email for Booking confirmation
   * @param {Object} data
   */
  async boatBookingConfirmation(param) {
    try {
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'send-email.ejs',
        data,
      });

      const options = {
        to: data.email,
        subject: "Booking Confirmation Notification",
        message: result,
      };

      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
   * Send email for Booking Cancellation
   * @param {Object} data
   */
  async boatBookingCancellation(param) {
    try {
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'send-email.ejs',
        data,
      });
      const options = {
        to: data.email,
        subject: "Booking Cancellation Notification",
        message: result,
      };
      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
   * Send email for payout transfer
   * @param {Object} data
   */

  async boatBookingPayoutTransfer(param) {
    try {
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'payout-transfer.ejs',
        data,
      });
      const options = {
        to: data.email,
        subject: "Payout Sent Notification",
        message: result,
      };
      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
  * Send email for recieved messages
  * @param {Object} data
  */
  async receivedMessages(param) {
    try {
      const { adminUrl } = config.app;
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      data.redirect_url = `${adminUrl}otp-verification`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'send-email.ejs',
        data,
      });
      const options = {
        to: data.email,
        subject: data.subject,
        message: result,
      };
      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
  * Send email for pre approval booking
  * @param {Object} data
  */
  async preApprovalBooking(param) {
    try {
      const { adminUrl } = config.app;
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      data.redirect_url = `${adminUrl}otp-verification`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'send-email.ejs',
        data,
      });

      const options = {
        to: data.email,
        subject: "Pre-Approval Booking Notification for Renter",
        message: result,
      };

      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
 * Send email for booking request created
 * @param {Object} data
 */
  async bookingRequest(param) {
    try {
      const { adminUrl } = config.app;
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      data.redirect_url = `${adminUrl}otp-verification`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'send-email.ejs',
        data,
      });

      const options = {
        to: data.email,
        subject: "Booking Request Notification",
        message: result,
      };
      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
   * Send email for boat approved listing
   * @param {Object} data
   */
  async boatApproved(param) {
    try {
      const { adminUrl } = config.app;
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      data.redirect_url = `${adminUrl}otp-verification`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'send-email.ejs',
        data,
      });

      const options = {
        to: data.email,
        subject: data.subject,
        message: result,
      };

      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
   * Send email for boat approval for listing
   * @param {Object} data
   */
  async boatsListedForApproval(param) {
    try {
      const { adminUrl } = config.app;
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      data.redirect_url = `${adminUrl}otp-verification`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'boats-listed.ejs',
        data,
      });

      const options = {
        to: data.email,
        subject: "New Boat Listing Requires Review and Approval",
        message: result,
      };

      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
  * Send email for documents approved
  * @param {Object} data
  */
  async documentsApproved(param) {
    try {
      const { adminUrl } = config.app;
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      data.redirect_url = `${adminUrl}otp-verification`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'send-email.ejs',
        data,
      });

      const options = {
        to: data.email,
        subject: data.subject,
        message: result,
      };

      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
 * Send email for documents recieved by admin
 * @param {Object} data
 */
  async documentsReceivedByAdmin(param) {
    try {
      const { adminUrl } = config.app;
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      data.redirect_url = `${adminUrl}otp-verification`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'send-email.ejs',
        data,
      });

      const options = {
        to: data.email,
        subject: "Document Submission Notification for Approval",
        message: result,
      };

      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
   * Send email for ticket bought for event
   * @param {Object} data
   */
  async ticketsBoughtForEvent(param) {
    try {
      const { adminUrl } = config.app;
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      data.redirect_url = `${adminUrl}otp-verification`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'send-email.ejs',
        data,
      });

      const options = {
        to: data.email,
        subject: `Event Ticket Purchase Confirmation  - Booking ID ${data?.id ?? ''}`,
        message: result,
      };

      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },
  /**
     * Send email for ticket bought for event cancellation
     * @param {Object} data
     */
  async ticketsBoughtForEventCancellation(param) {
    try {
      const { adminUrl } = config.app;
      const data = param;
      data.logoTop = `${config.app.baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${config.app.baseUrl}public/default-images/logoBottom.png`;
      data.redirect_url = `${adminUrl}otp-verification`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'send-email.ejs',
        data,
      });

      const options = {
        to: data.email,
        subject: `Event Ticket Purchase Cancellation  - Booking ID ${data?.id ?? ''}`,
        message: result,
      };

      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
     * Send email for ticket bought for event cancellation
     * @param {Object} data
     */
  async eventRescheduled(param) {
    try {
      const { baseUrl } = config.app;
      const data = param;
      data.lines = [
        data.message,
        "All tickets will be honored for the new date.",
        "Thank you for your understanding and support!",
        "For questions, please contact us at admin@myboatsplash.com or via what’s app at +1 (786) 763-0071."
      ]
      data.logoTop = `${baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${baseUrl}public/default-images/logoBottom.png`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'event-notification.ejs',
        data,
      });

      const options = {
        to: data.email,
        subject: data.subject,
        message: result,
      };

      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },

  /**
     * Send email for ticket bought for event cancellation
     * @param {Object} data
     */
  async eventCancelled(param) {
    try {
      const { baseUrl } = config.app;
      const data = param;
      data.lines = [
        data.message,
        "All ticket holders will receive a full refund.",
        "We apologize for any inconvenience and appreciate your understanding.",
        "For questions, please contact us at admin@myboatsplash.com or via what’s app at +1 (786) 763-0071."
      ]
      data.logoTop = `${baseUrl}public/default-images/logoTop.png`;
      data.logoBottom = `${baseUrl}public/default-images/logoBottom.png`;
      const result = await ejsTemplate.generateEjsTemplate({
        template: 'event-notification.ejs',
        data,
      });

      const options = {
        to: data.email,
        subject: data.subject,
        message: result,
      };

      return await emailer.sendEmail(options);
    } catch (error) {
      loggers
        .dailyLogger('emailError')
        .error(new Error(`Mail sent error ${error}`));
      throw Error(error);
    }
  },
};
