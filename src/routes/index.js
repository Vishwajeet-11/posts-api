import { Router } from 'express';
import postRoutes from './post.routes.js';
import tagRoutes from './tag.routes.js';

const router = Router();

router.use('/tags', tagRoutes);
router.use('/posts', postRoutes);

router.get('/health', (req, res) => res.json({ status: 'ok' }));

export default router;
