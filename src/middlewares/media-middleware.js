import HttpStatus from 'http-status';
import { find } from 'lodash';
import s3Bucket from '../services/s3-bucket';
import repositories from '../repositories';

const { mediaRepository } = repositories;

export default {
  /**
   * Check media exist by base path
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkMediaExists(req, res, next) {
    const { params } = req;
    try {
      const basePathStr = params.basePath;
      const basePathStrArray = params.basePathArray || [];
      let message;
      if (basePathStrArray.length < 1) {
        next();
      }

      basePathStrArray.push(basePathStr);
      const medias = await mediaRepository.findAllByBasePathIn(
        basePathStrArray,
      );

      const error = basePathStrArray.find((element) => {
        const isExist = find(medias, { basePath: element });
        // eslint-disable-next-line no-return-assign
        return !isExist && (message = `Media file not found, for '${element}'`);
      });

      if (!error) {
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check media for
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkMediaFor(req, res, next) {
    const { params } = req;
    try {
      const basePathStr = params.basePath;
      const basePathStrArray = params.basePathArray || [];
      const regexp = RegExp(`${params.mediaFor}(\\\\|/)`);
      let message;
      let error;

      if (basePathStrArray.length < 1) {
        next();
      }
      basePathStrArray.push(basePathStr);

      if (basePathStrArray && basePathStrArray.length) {
        error = basePathStrArray.find(
          // eslint-disable-next-line no-return-assign
          (element) => !element.match(regexp)
            && (message = `Invalid media type for '${params.mediaFor}', in '${element}'`),
        );
      }

      if (!error) {
        next();
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          data: [],
          message,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check media exist by base path
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async checkMediaExistsS3(req, res, next) {
    try {
      const basePathStr = req.body.mediaFile;
      s3Bucket
        .checkS3MediaExist(basePathStr)
        .then((result) => {
          if (result) {
            next();
          } else {
            res.status(HttpStatus.BAD_REQUEST).json({
              success: false,
              data: [],
              message: 'Media not found in our storage.',
            });
          }
        })
        .catch(() => {
          res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            data: [],
            message: 'Media not found in our storage.',
          });
        });
    } catch (error) {
      next(error);
    }
  },
};
