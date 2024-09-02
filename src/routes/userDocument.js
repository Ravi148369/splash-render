import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { userDocumentValidator } = validations;
const { userDocumentController } = controllers;
const {
  authMiddleware, resourceAccessMiddleware, validateMiddleware, userMiddleware,
} = middlewares;

router.post(
  '/user/document',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  validateMiddleware({
    schema: userDocumentValidator.addAndUpdateUserDocumentSchema,
  }),
  userDocumentController.addUserDocument,
);

router.get(
  '/user/document',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  userDocumentController.getUserDocuments,
);

router.get(
  '/admin/user-document',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  userDocumentController.getUserDocumentsForAdmin,
);

router.put(
  '/admin/user-document/:id/change-status',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({
    schema: userDocumentValidator.UpdateUserDocumentStatusSchema,
  }),
  userDocumentController.updateUserDocumentStatus,
);

router.delete(
  '/user/document/:id',
  authMiddleware,
  resourceAccessMiddleware(['user']),
  userMiddleware.checkUserDocumentExists,
  userDocumentController.deleteUserDocument,
);

export default router;
