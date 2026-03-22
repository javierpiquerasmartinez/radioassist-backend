import { Router } from 'express';
import { generate, getHistory } from '../controllers/reports.controller.js';

const router = Router();

router.post('/generate', generate);
router.get('/', getHistory);

export default router;
