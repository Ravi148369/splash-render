/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import HttpStatus from 'http-status';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3-transform';
import sharp from 'sharp';
import repositories from '../repositories';
import config from '../config';
import utility from '../services/utility';
import constant from '../constant';

const { commonConstant } = constant;
const { mediaRepository } = repositories;

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  Bucket: config.aws.bucketName,
});

// Transform image Ref : https://stackoverflow.com/a/40237279
const storageAWS = multerS3({
  s3,
  bucket(req, file, cb) {
    const bucketPath = config.aws.bucketName;
    cb(null, bucketPath);
  },
  contentType: (req, file, cb) => {
    cb(null, file?.mimetype);
  },
  // public-read: available public, authenticated-read: need to create signed up url
  ACL(req, file, cb) {
    const acl = 'authenticated-read';
    cb(null, acl);
  },
  metadata(req, file, cb) {
    const datetimestamp = Date.now();
    const filename = file.originalname.replace(/[^A-Z0-9.]/gi, '-');
    const fileArray = filename.split('.');
    const ext = fileArray.pop();

    const newFileName = `${fileArray.join('-')}-${datetimestamp}.${ext}`;
    file.newFileName = newFileName;

    cb(null, {
      fieldName: file.fieldname,
    });
  },
  key(req, file, cb) {
    const { mediaType, mediaFor } = req.params;
    let dir = '';
    if (mediaType === 'audio' || mediaType === 'video' || mediaType === 'file') {
      const datetimestamp = Date.now();
      const filename = file.originalname.replace(/[^A-Z0-9.]/gi, '-');
      const fileArray = filename.split('.');
      const ext = fileArray.pop();

      const newFileName = `${fileArray.join('-')}-${datetimestamp}.${ext}`;
      file.newFileName = newFileName;
      dir = `${mediaType}/${mediaFor}/`;
    }
    cb(null, `${dir}${file.newFileName || ''}`);
  },
  shouldTransform(req, file, cb) {
    cb(null, /^image/i.test(file.mimetype));
  },
  transforms: [
    {
      id: 'original',
      key(req, file, cb) {
        const { mediaFor } = req.params;

        const dir = mediaFor;

        cb(null, `${dir}/${file.newFileName}`);
      },
      transform(req, file, cb) {
        cb(null, sharp().png());
      },
    },
    {
      id: 'thumbnail',
      key(req, file, cb) {
        const { mediaFor } = req.params;

        const dir = `${mediaFor}/thumb`;

        cb(null, `${dir}/${file.newFileName}`);
      },
      transform(req, file, cb) {
        cb(null, sharp().resize({ width: 255 }).png());
      },
    },
  ],
});

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { mediaType, mediaFor } = req.params;
    const fileDir = path.join(
      __dirname,
      `../../public/uploads/${mediaType}/${mediaFor}/thumb`,
    );
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true }, (err) => {
        throw Error(err);
      });
    }

    file.thumbDir = fileDir;

    cb(null, `public/uploads/${mediaType}/${mediaFor}/`);
  },
  filename: (req, file, cb) => {
    const datetimestamp = Date.now();
    const filename = file.originalname.replace(/[^A-Z0-9.]/gi, '-');
    const fileArray = filename.split('.');
    const ext = fileArray.pop();
    cb(null, `${fileArray.join('-')}-${datetimestamp}.${ext}`);
  },
});

const uploadFile = multer({
  storage: config.app.mediaStorage === commonConstant.MEDIA.MEDIA_STORAGE.LOCAL
    ? storage : storageAWS,
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    let fileFormats = [];
    if (req.params.mediaType === 'image') {
      fileFormats = ['.png', '.jpg', '.gif', '.jpeg'];
    } else if (req.params.mediaType === 'video') {
      fileFormats = ['.mp4', '.mov', '.wmv', '.mp4'];
    } else if (req.params.mediaType === 'audio') {
      fileFormats = ['.aac', '.m4a', '.mp3'];
    } else if (req.params.mediaType === 'file') {
      fileFormats = ['.pdf', '.doc', '.docx'];
    } else if (req.params.mediaType === 'media') {
      fileFormats = [
        '.png',
        '.jpg',
        '.gif',
        '.aac',
        '.m4a',
        '.mp3',
        '.jpeg',
        '.pdf',
        '.doc',
        '.docx',
        '.mp4',
        '.mov',
        '.wmv',
      ];
    }
    if (fileFormats.indexOf(ext.toLowerCase()) === -1) {
      return callback(
        new Error(`Allowed file format ${fileFormats.toString()}.`),
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: config.app.mediaUploadSizeLimit,
  },
});

const createThumb = async (req, next) => {
  const { filename: image, thumbDir } = req.file;
  try {
    await sharp(req.file.path)
      .resize(150)
      .jpeg({ quality: 50 })
      .toFile(`${thumbDir}/${image}`);
    return true;
  } catch (error) {
    next(error);
  }
};

export default {
  /**
   * Upload media AWS
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async uploadMedia(req, res, next) {
    try {
      const { params } = req;
      const { mediaType } = params;
      params.mediaType = mediaType;
      uploadFile.single('file')(req, res, async (error) => {
        if (error instanceof multer.MulterError) {
          if (error.code === 'LIMIT_FILE_SIZE') {
            error.message = utility.getMessage(
              req,
              false,
              'MEDIA_SIZE_VALIDATION',
            );
          }
          error.status = HttpStatus.BAD_REQUEST;
          return next(error);
        }
        if (error) {
          // An unknown error occurred when uploading.
          error.status = HttpStatus.BAD_REQUEST;
          return next(error);
        }

        if (config.app.mediaStorage === commonConstant.MEDIA.MEDIA_STORAGE.LOCAL) {
          // Generate Image thumb
          if (mediaType === 'image') {
            await createThumb(req, next);
          }
        }
        next();
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Save media AWS
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  async saveMedia(req, res, next) {
    try {
      const result = await mediaRepository.createAWS(req);
      res.status(HttpStatus.CREATED).json({
        success: true,
        data: result,
        message: '',
      });
    } catch (error) {
      next(error);
    }
  },
};
