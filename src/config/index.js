import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
export default {
  app: {
    siteName: process.env.SITE_NAME,
    siteEmail: '',
    mediaStorage: process.env.MEDIA_STORAGE,
    mediaUploadSizeLimit: 1024 * 1024 * 15,
    baseUrl: process.env.BASE_URL,
    adminUrl: process.env.ADMIN_URL,
    resetUrl: process.env.RESET_URL,
    environment: process.env.NODE_ENV,
    swaggerHost: process.env.SWAGGER_HOST,
    languages: ['en', 'hi'],
    setBaseUrl(url) {
      this.baseUrl = url;
    },
  },
  database: {
    mysql: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      db: process.env.DB_NAME,
      timezone: '+00:00',
    },
  },
  mail: {
    from_name: process.env.SMTP_EMAIL_FROM_NAME || 'node@codiantdev.com',
    from_email: process.env.SMTP_EMAIL_FROM_EMAIL || 'node@codiantdev.com',
    is_smtp: true,
    smtp: {
      host: process.env.SMTP_HOST || 'mail.codiantdev.com',
      port: process.env.SMTP_HOST_PORT || '587',
      user: process.env.SMTP_USERNAME || 'node@codiantdev.com',
      password: process.env.SMTP_PASSWORD || 'ZQ*IB0?y6&uM',
      isSecure: false,
    },
  },
  sms: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      fromNumber: process.env.TWILIO_FROM_NUMBER,
    },
  },
  notification: {
    ios: {
      token: {
        key: path.join(__dirname, 'ios-token', 'example.p8'),
        keyId: '',
        teamId: '',
      },
      production: true,
    },
    android: {
      fcm: {
        server_key: '',
      },
    },
  },

  aws: {
    bucketPrefix: process.env.AWS_BUCKET_PREFIX,
    bucketName: process.env.AWS_BUCKET_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3BucketUrl: process.env.AWS_S3_BUCKET_URL,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpireIn: process.env.JWT_EXPIRE_IN,
  encryption: {
    key: process.env.ENCRYPTION_KEY,
  },
  stripe: {
    publishableKey: process.env.STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
  sendGrid: {
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    email: process.env.SEND_GRID_FROM_EMAIL,
  },
};
