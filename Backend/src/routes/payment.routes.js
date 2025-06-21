import { Router } from 'express';
import { getPlans, subscribePlan } from '../controllers/payment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route to get available plans
router.get('/plans', getPlans);

// Protected route to subscribe/upgrade
router.use(verifyJWT);
router.post('/subscribe', subscribePlan);

export default router;
