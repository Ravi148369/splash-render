import HttpStatus from 'http-status';
import jwt from '../services/jwt';
import userRepository from '../repositories/user-repository';
import accountRepository from '../repositories/account-repository';
import utility from '../services/utility';
/**
 * Authorization jwt token create and verify
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
const authValidateRequest = async (req, res, next) => {
  try {
    const skippedApis = [];
    if (req.headers && req.headers.authorization) {
      const { apiName } = req.params;
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2) {
        const scheme = parts[0];
        const token = parts[1];

        if (/^Bearer$/i.test(scheme)) {
          const decodedToken = await jwt.verifyToken(token);
          if (decodedToken) {
            const user = await userRepository.findOne({ id: decodedToken.id });
            // Find user detail from token
            if (
              user
              && (user.status === 'active' || skippedApis.indexOf(apiName) !== -1)
            ) {
              const userToken = await accountRepository.getDeviceDetailByToken(
                token,
              );
              if (userToken) {
                req.user = user;
                req.userRole = user.userRole.role.dataValues.role;

                next();
              } else {
                const error = new Error('TOKEN_BAD_FORMAT');
                error.status = HttpStatus.UNAUTHORIZED;
                error.message = utility.getMessage(
                  req,
                  false,
                  'SESSION_EXPIRE',
                ); // 'Format is Authorization: Bearer [token]';
                next(error);
              }
            } else {
              const error = new Error();
              error.status = HttpStatus.UNAUTHORIZED;
              error.message = utility.getMessage(
                req,
                false,
                'ACCOUNT_INACTIVE',
              );
              next(error);
            }
          } else {
            const error = new Error('TOKEN_NOT_FOUND');
            error.status = HttpStatus.BAD_REQUEST;
            error.message = utility.getMessage(
              req,
              false,
              'UNAUTHORIZED_ACCESS',
            );
            next(error);
          }
        } else {
          const error = new Error('TOKEN_BAD_FORMAT');
          error.status = HttpStatus.UNAUTHORIZED;
          error.message = utility.getMessage(req, false, 'SESSION_EXPIRE'); // 'Format is Authorization: Bearer [token]';
          next(error);
        }
      } else {
        const error = new Error('TOKEN_BAD_FORMAT');
        error.status = HttpStatus.UNAUTHORIZED; // HttpStatus['401'];
        error.message = utility.getMessage(
          req,
          false,
          'UNAUTHORIZED_USER_ACCESS',
        ); // 'Format is Authorization: Bearer [token]';
        next(error);
      }
    } else {
      const error = new Error('TOKEN_NOT_FOUND');
      error.status = HttpStatus.BAD_REQUEST;
      error.message = utility.getMessage(req, false, 'UNAUTHORIZED_ACCESS');
      next(error);
    }
  } catch (error) {
    error.status = HttpStatus.UNAUTHORIZED;
    next(error);
  }
};
export default authValidateRequest;
