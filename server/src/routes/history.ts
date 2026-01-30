
import { Router } from 'express';
import { historyController } from '../controllers/historyController';

const router = Router();

router.get('/', historyController.getHistory);

export default router;