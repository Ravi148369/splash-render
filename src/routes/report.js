import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { reportValidator } = validations;
const { reportController } = controllers;
const {
  authMiddleware, resourceAccessMiddleware, validateMiddleware, reportMiddleware,
} = middlewares;

router.post(
  '/report',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({ schema: reportValidator.addReportSchema }),
  reportMiddleware.checkAllReadyReportExist,
  reportMiddleware.VerifyUserOwnerExist,
  reportController.addReport,
);

router.get(
  '/report',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  reportController.getUserReports,
);

export default router;
