import { Router } from 'express';
import * as postCtrl from '../controllers/post.controller.js';
const router = Router();

// create with optional image upload
router.post('/', postCtrl.uploadImage, postCtrl.create);

router.patch('/:id', postCtrl.uploadImage, postCtrl.update);

router.get('/search', postCtrl.searchPosts);
// list with filters, sort, pagination
router.get('/', postCtrl.list);

router.get('/:id', postCtrl.get);

router.delete('/:id', postCtrl.remove);

export default router;
