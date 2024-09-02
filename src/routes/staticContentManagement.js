import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { staticContentManagementValidator } = validations;
const { staticContentPageController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  staticContentManagementMiddleware,
} = middlewares;

router.get(
  '/cms/static-content-pages',
  staticContentPageController.getStaticContentPages,
);

router.get(
  '/cms/static-content-pages/:id',
  staticContentManagementMiddleware.checkPageExists,
  staticContentPageController.getStaticContentPagesDetail,
);

router.put(
  '/cms/static-content-pages/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  staticContentManagementMiddleware.checkPageExists,
  validateMiddleware({
    schema: staticContentManagementValidator.addStaticContentPageSchema,
  }),
  staticContentPageController.updateStaticContentPage,
);

router.post(
  '/admin/banner-page',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({
    schema: staticContentManagementValidator.addAndUpdateBannerAndPageSchema,
  }),
  staticContentPageController.addAndUpdateBannerImageAndPageContent,
);

router.get(
  '/admin/banner-page',
  staticContentPageController.getBannerImageAndPageContent,
);

router.post(
  '/admin/footer-block',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  validateMiddleware({
    schema: staticContentManagementValidator.addAndUpdateFooterBlockSchema,
  }),
  staticContentPageController.addAndUpdateFooterBlockDetails,
);

router.get(
  '/admin/footer-block',
  staticContentPageController.getFooterBlockDetails,
);

export default router;
