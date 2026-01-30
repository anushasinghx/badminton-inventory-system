
import { Router } from 'express';
import { exportController } from '../controllers/exportController';

const router = Router();

router.get('/csv', exportController.exportCSV);
router.get('/json', exportController.exportJSON);

export default router;