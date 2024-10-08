/* eslint-disable import/no-extraneous-dependencies */
import rateLimit from 'express-rate-limit';

const ACCOUNT_LIMITER = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: { success: false, data: [], message: 'Too many attempt, please try again after an hour' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default {
  ACCOUNT_LIMITER,
};
