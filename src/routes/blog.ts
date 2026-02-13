import { Router } from 'express';
import { getAllPosts, getPostBySlug, createPost, updatePost, deletePost } from '../controllers/blogController';
import { authenticateToken } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getAllPosts);
router.get('/:slug', getPostBySlug);
router.post('/', authenticateToken, authorize('admin', 'business_owner'), upload.single('featuredImage'), createPost);
router.put('/:id', authenticateToken, authorize('admin', 'business_owner'), upload.single('featuredImage'), updatePost);
router.delete('/:id', authenticateToken, authorize('admin', 'business_owner'), deletePost);

export default router;
