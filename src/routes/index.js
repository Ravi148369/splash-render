/* eslint-disable prefer-regex-literals */
/* eslint-disable no-unused-vars */
import { Router } from 'express';
import HttpStatus from 'http-status';
import logger from '../services/logger';
import utility from '../services/utility';
import account from './account';
import media from './media';
import admin from './admin';
import user from './user';
import staticContentManagement from './staticContentManagement';
import listing from './listing';
import boatType from './boatType';
import boatMake from './boatMake';
import boatYear from './boatYear';
import boatFeature from './boatFeature';
import boatRule from './boatRule';
import boatModel from './boatModel';
import boat from './boat';
import event from './event';
import popularLocation from './popularLocation';
import blog from './blog';
import userDocument from './userDocument';
import ownerPageSetting from './ownerPageSetting';
import aboutUsPageSetting from './aboutUsPageSetting';
import review from './review';
import booking from './booking';
import favorite from './favorite';
import siteSetting from './siteSetting';
import message from './bookingMessage';
import bankAccount from './bankAccount';
import serviceFees from './serviceFees';
import support from './support';
import notification from './notification';
import report from './report';
import salesTax from './salesTax';

const router = Router();
const register = (app) => {
  app.use(router);

  router.use('/api', [
    account,
    media,
    admin,
    user,
    staticContentManagement,
    listing,
    boatType,
    boatMake,
    boatYear,
    boatFeature,
    boatRule,
    boatModel,
    boat,
    event,
    popularLocation,
    blog,
    userDocument,
    ownerPageSetting,
    aboutUsPageSetting,
    review,
    booking,
    favorite,
    siteSetting,
    message,
    bankAccount,
    serviceFees,
    salesTax,
    support,
    notification,
    report,
  ]);

  // app.use((error, req, res, next) => {
  //   res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
  //     success: false,
  //     data: null,
  //     error,
  //     message: error.message,
  //   });
  // });

  app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = HttpStatus.NOT_FOUND;
    res.status(error.status).json({
      success: false,
      data: null,
      error,
      message: error.message,
    });
  });

  app.use((error, req, res, next) => {
    const internalError = HttpStatus.INTERNAL_SERVER_ERROR;
    if (error) {
      logger.dailyLogger('ERROR').info(`Error : ${error}`);
    }
    let statusCode = error?.status
      ? HttpStatus.BAD_REQUEST
      : internalError;
    if (error?.status === HttpStatus.UNAUTHORIZED) {
      statusCode = HttpStatus.UNAUTHORIZED;
    }
    let errorMessage = statusCode === internalError
      ? utility.getMessage(req, false, 'INTERNAL_ERROR')
      : String(error?.message)
        ?.replace(new RegExp('Error:', 'g'), '')
        ?.trim();
    if (error.errorCode === 1) {
      errorMessage = String(error)
        ?.replace(new RegExp('Error:', 'g'), '')
        ?.trim();
    }
    res.status(statusCode).json({
      success: false,
      data: null,
      error,
      message: errorMessage,
    });
  });
};
export default register;
