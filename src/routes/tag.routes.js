import { Router } from 'express';
import { create, list } from '../controllers/tag.controller.js';

const router = Router();

// create a tag
router.post('/', create);

// list tags with pagination
router.get('/', list);

export default router;
