import sgMail from '@sendgrid/mail';
import config from '../config';
import logMessage from './logger';

const {
  sendGrid: { sendGridApiKey, email },
} = config;
export default {
  /**
   * Send email using send grid
   */
  sendGridEmail(obj) {
    try {
      const {
        html, subject, to, bcc, cc, attachments,
      } = obj;
      const mailOptions = {
        from: email,
        to,
        subject,
        html,
      };
      // BCC users
      if (bcc) {
        mailOptions.bcc = bcc;
      }
      // CC users
      if (cc) {
        mailOptions.cc = cc;
      }
      // Attachment file
      if (attachments) {
        mailOptions.attachments = attachments;
      }
      sgMail.setApiKey(sendGridApiKey);
      sgMail
        .send(mailOptions)
        .then(() => { }, (error) => {
          if (error.response) {
            logMessage.dailyLogger('email').error(new Error(`Email send error ${error}`));
          }
        });
      return true;
    } catch (error) {
      logMessage.dailyLogger('emailError').error(new Error(`Email send error ${error}`));
      throw Error(error);
    }
  },
};
