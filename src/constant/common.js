const DATE_TIME_FORMATE = {
  ONLY_DATE: 'YYYY-MM-DD',
  DATE_AND_TIME: 'YYYY-MM-DD HH:mm:ss',
};

const ROLE = {
  ADMIN: 'admin',
  USER: 'user',
  RENTER: 'renter',
  OWNER: 'owner',
};

const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DELETED: 'deleted',
  INVALID: 'invalid',
  UPDATED: 'updated',
  PENDING: 'pending',
};

const COUNTRY = {
  US: 'US',
};

const CURRENCY = {
  USD: 'usd',
};

const TIMEZONE = {
  INDIA: 'Asia/Calcutta',
};

const MEDIA = {
  IMAGE_TYPE: 'image',
  VIDEO_TYPE: 'video',
  File_TYPE: 'file',
  MEDIA_FOR_VIDEO_TRACK: 'video-track',
  MEDIA_STORAGE: {
    S3: 's3',
    LOCAL: 'local',
  },
  STATUS: {
    PENDING: 'pending',
    USED: 'used',
  },
};

const NOTIFICATION = {
  STATUS: {
    PENDING: 'pending',
    DELETED: 'deleted',
  },
  READ_STATUS: {
    READ: 'read',
    UNREAD: 'unread',
  },
};

export default {
  DATE_TIME_FORMATE,
  ROLE,
  COUNTRY,
  STATUS,
  CURRENCY,
  TIMEZONE,
  MEDIA,
  NOTIFICATION,
};
