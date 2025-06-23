import { Router } from 'express'; import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware'; import { getDashboardDataHandler } from '../controllers/dashboardController';

const router = Router();

router.get('/', authMiddleware, roleMiddleware(['ADMIN', 'USER']), getDashboardDataHandler);

export default router;