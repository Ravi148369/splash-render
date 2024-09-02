import HttpStatus from 'http-status';

/**
 * Check resource access permission
 * According to user role
 * @param {Array} userTypeArr
 * @param {function} next
 * @param {object} req
 */
const resourceAccessGuard = (userTypeArr) => async (req, res, next) => {
  try {
    if (userTypeArr.includes(req.userRole)) {
      next();
    } else {
      const error = new Error('INVALID_USER_ACCESS');
      error.status = HttpStatus.BAD_REQUEST;
      error.message = `Resource can not be accessed by [${req.userRole}]`;
      next(error);
    }
  } catch (error) {
    error.status = HttpStatus.UNAUTHORIZED;
    next(error);
  }
};

export default resourceAccessGuard;
