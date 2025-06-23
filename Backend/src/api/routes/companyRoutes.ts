import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';
import { createCompanyHandler } from '../controllers/companyController';

const router = Router();

router.post('/', authMiddleware, roleMiddleware(['ADMIN', 'USER']), createCompanyHandler);

export default router;

