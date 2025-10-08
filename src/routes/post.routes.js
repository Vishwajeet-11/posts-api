import { Router } from 'express';
import * as postCtrl from '../controllers/post.controller.js';
const router = Router();

// create with optional image upload
router.post('/', postCtrl.uploadImage, postCtrl.create);

// update with optional image upload
router.patch('/:id', postCtrl.uploadImage, postCtrl.update);

// list with filters, sort, pagination
router.get('/', postCtrl.list);

// get single post
router.get('/:id', postCtrl.get);

// delete post
router.delete('/:id', postCtrl.remove);

export default router;
