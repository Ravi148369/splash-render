import fs from 'fs';
import path from 'path';
import config from '../config';
import models from '../models';
import s3Bucket from '../services/s3-bucket';
import logMessage from '../logMessages/index';
import constant from '../constant';

const { commonConstant } = constant;
const { media } = models;
const { Op, literal } = models.Sequelize;

export default {
  /**
   * Find all and remove
   * @returns
   */
  async findAllAndRemove() {
    try {
      const where = {
        [Op.and]: literal('TIMESTAMPDIFF(MINUTE, `created_at`, NOW()) > 30'),
        status: 'pending',
      };
      const result = await media.findAll(
        { where },
      );
      const pendingMediaIds = [];
      const unlinkMediaPromises = result.map((mediaData) => {
        pendingMediaIds.push(mediaData.id);
        return this.unlinkMedia(mediaData);
      });

      unlinkMediaPromises.push(
        media.destroy({
          where: {
            id: {
              [Op.in]: pendingMediaIds,
            },
          },
        }),
      );
      await Promise.all(unlinkMediaPromises);

      return result;
    } catch (error) {
      throw Error(error);
    }
  },

  /**
   * Unlink media file
   * @param {Object} mediaData
   * @returns
   */
  async unlinkMedia(mediaData) {
    const fileDir = mediaData.basePath;
    const objects = [{ Key: mediaData.basePath }];
    // (\\\\|/)Image(\\\\|/)
    // eslint-disable-next-line prefer-regex-literals
    const regexp = RegExp('image(\\\\|/)');
    if (fileDir && fileDir.match(regexp)) {
      const imagePathArray = fileDir.split('/');
      const imageName = imagePathArray.pop();
      imagePathArray.push('thumb');
      imagePathArray.push(imageName);
      const thumbPath = imagePathArray.join('/');
      if (thumbPath) {
        objects.push({ Key: thumbPath });
      }
    }
    const imageObj = { objects };
    if (config.app.mediaStorage === commonConstant.MEDIA.MEDIA_STORAGE.S3) {
      if (media.mediaFor === commonConstant.MEDIA.MEDIA_FOR_VIDEO_TRACK) {
        s3Bucket.unlinkVideoFromS3(imageObj);
      } else {
        s3Bucket.unlinkMediaFromS3(imageObj);
      }
    } else {
      // For local delete media
      await this.unlinkMediaFromLocal(mediaData);
    }
  },

  /**
   * Unlink media file from local
   * @param {Object} mediaData
   * @returns
   */
  async unlinkMediaFromLocal(mediaData) {
    try {
      const fileDir = path.join(__dirname, `../../${mediaData.basePath}`);
      fs.existsSync(fileDir);
      fs.unlinkSync(fileDir);
      // eslint-disable-next-line prefer-regex-literals
      const regexp = RegExp('image(\\\\|/)');
      if (fileDir && fileDir.match(regexp)) {
        const imagePathArray = fileDir.split('/');
        const imageName = imagePathArray.pop();
        imagePathArray.push('thumb');
        imagePathArray.push(imageName);
        const thumbPath = imagePathArray.join('/');
        fs.existsSync(thumbPath);
        fs.unlinkSync(thumbPath);
      }
    } catch (error) {
      logMessage.mediaErrorMessage('unlinkMedia', { error });
    }
  },

  /**
   * Save media file
   * @param {Object} req
   * @returns
   */
  async createAWS({
    params, file, headers, connection,
  }) {
    try {
      let result = '';
      // const basePath = '';
      // const baseUrl = '';
      const { mediaType } = params;
      const imageDir = path.join(__dirname, `../../${file.path}`);
      const HTTPs = connection.encrypted === undefined ? 'http' : 'https';
      if (config.app.mediaStorage === commonConstant.MEDIA.MEDIA_STORAGE.S3
        && params.mediaType === commonConstant.MEDIA.IMAGE_TYPE) {
        const originalFileObj = file.transforms.findIndex(
          (data) => data.id === 'original',
        );
        const finalPath = file?.transforms[originalFileObj].key;
        this.basePath = finalPath;
        this.baseUrl = `${config.aws.s3BucketUrl}${finalPath}`;
      } else if (config.app.mediaStorage === commonConstant.MEDIA.MEDIA_STORAGE.S3
        && (params.mediaType === commonConstant.MEDIA.VIDEO_TYPE
          || params.mediaType === commonConstant.MEDIA.File_TYPE)) {
        const finalPath = file.key;
        this.basePath = finalPath;
        this.baseUrl = `${config.aws.s3BucketUrl}${finalPath}`;
      } else {
        this.basePath = file.path;
        this.baseUrl = `${HTTPs}://${headers.host}/${file.path}`;
      }
      const mediaData = {
        name: file.filename || file.originalname,
        basePath: this.basePath,
        imagePath: imageDir,
        baseUrl: this.baseUrl,
        mediaType,
        mediaFor: params.mediaFor,
        isThumbImage: false,
        status: commonConstant.MEDIA.STATUS.PENDING,
      };
      result = await media.create(mediaData);

      return result;
    } catch (error) {
      logMessage.mediaErrorMessage('mediaAdd', { error });
      throw Error(error);
    }
  },

  /**
   * Save multiple media file
   * @param {Object} req
   * @returns
   */
  async createMultiple(req) {
    const {
      params, files, headers, connection,
    } = req;
    try {
      const HTTPs = connection.encrypted === undefined ? 'http' : 'https';
      const mediaDataArray = files.map((file) => ({
        name: file.filename,
        basePath: file.path,
        baseUrl: `${HTTPs}://${headers.host}/${file.path}`,
        mediaType: params.mediaType,
        mediaFor: params.mediaFor,
        status: commonConstant.MEDIA.STATUS.PENDING,
      }));

      return await media.bulkCreate(mediaDataArray);
    } catch (error) {
      logMessage.mediaErrorMessage('bulkMediaAdd', { error });
      throw Error(error);
    }
  },

  /**
   * Find all media file by base_path
   * @param {Array} paths
   * @returns
   */
  async findAllByBasePathIn(paths) {
    try {
      const where = {
        status: commonConstant.MEDIA.STATUS.PENDING,
        basePath: {
          [Op.in]: paths,
        },
      };
      return await media.findAll({ where });
    } catch (error) {
      logMessage.mediaErrorMessage('mediaList', { error });
      throw Error(error);
    }
  },

  /**
   * Change media status
   * @param {Array} paths
   * @returns
   */
  async makeUsedMedias(paths) {
    const transaction = await models.sequelize.transaction();
    try {
      const mediaData = {
        status: commonConstant.MEDIA.STATUS.USED,
      };
      const result = await media.update(
        mediaData,
        {
          where: {
            basePath: {
              [Op.in]: paths,
            },
          },
        },
        {
          transaction,
        },
      );
      await transaction.commit();

      return result;
    } catch (error) {
      await transaction.rollback();
      logMessage.mediaErrorMessage('mediaAdd', { error });
      throw Error(error);
    }
  },
};
