import nodemailer from 'nodemailer';
import config from '../config';
import sendGridService from './sendgrid-email-service';

const smtpConfig = {
  host: config.mail.smtp.host,
  port: config.mail.smtp.port,
  secure: config.mail.smtp.isSecure,
  auth: {
    user: config.mail.smtp.user,
    pass: config.mail.smtp.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
};
const transport = nodemailer.createTransport(smtpConfig);

export default {
  sendEmail(options) {
    const mailOptions = {
      from: config.mail.from_email,
      to: options.to,
      subject: options.subject,
      html: options.message,
    };
    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }
    if (process.env.NODE_ENV === 'development') {
      return new Promise((resolve, reject) => {
        try {
          const sendResult = sendGridService.sendGridEmail(mailOptions);
          if (sendResult) {
            resolve(sendResult);
          }
        } catch (error) {
          reject(error);
        }
      });
    }
    if (process.env.NODE_ENV === 'development') {
      return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        });
      });
    }
    return false;
  },
};
