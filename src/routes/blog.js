import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';
import validations from '../validations';

const router = Router();
const { blogValidator } = validations;
const { blogController } = controllers;
const {
  authMiddleware,
  resourceAccessMiddleware,
  validateMiddleware,
  blogMiddleware,
} = middlewares;

router.post(
  '/admin/blog',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  blogMiddleware.duplicateBlogExists,
  validateMiddleware({ schema: blogValidator.addAndUpdateBlogSchema }),
  blogController.addBlog,
);

router.get('/admin/blog', blogController.getBlogs);

router.get(
  '/admin/blog/:id',
  authMiddleware,
  blogMiddleware.checkBlogExists,
  blogController.getBlogDetail,
);

router.put(
  '/admin/blog/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  blogMiddleware.checkBlogExists,
  blogMiddleware.duplicateBlogExists,
  validateMiddleware({ schema: blogValidator.addAndUpdateBlogSchema }),
  blogController.updateBlog,
);

router.put(
  '/admin/blog/:id/change-status',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  blogMiddleware.checkBlogExists,
  validateMiddleware({ schema: blogValidator.UpdateBlogStatusSchema }),
  blogController.updateBlogStatus,
);

router.delete(
  '/admin/blog/:id',
  authMiddleware,
  resourceAccessMiddleware(['admin']),
  blogMiddleware.checkBlogExists,
  blogController.deleteBlog,
);

export default router;
