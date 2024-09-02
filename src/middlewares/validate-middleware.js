import HttpStatus from 'http-status';
import utility from '../services/utility';

const validateRequest = (options) => async (req, res, next) => {
  try {
    await options.schema.validateAsync({
      ...req.query,
      ...req.body,
      ...req.params,
    });

    next();
  } catch (error) {
    const errors = [];
    if (error.isJoi) {
      error.details.forEach((errorData) => {
        const errorMessage = utility.getMessage(req, false, errorData.message);
        const errorObject = {
          message: errorMessage,
          field: errorData.path.join('_'),
          type: errorData.type,
        };

        errors.push(errorObject);
      });
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        data: null,
        error: errors,
        message: '',
      });
    }
  }
};

export default validateRequest;
