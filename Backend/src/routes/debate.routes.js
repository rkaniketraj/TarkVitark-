import { Router } from 'express';
import {
    getActiveDebates,
    getUpcomingDebates,
    registerForDebate,
    getDebateDetails,
    createDebate,
    getHostedDebates,
    getParticipatedDebates,
    joinDebate,
    leaveDebate,
    updateDebateStatus
} from '../controllers/discussion.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/active', getActiveDebates);
router.get('/upcoming', getUpcomingDebates);
router.get('/:id', getDebateDetails);

// Protected routes
router.use(verifyJWT);
router.post('/register', registerForDebate);
router.post('/create', createDebate);
router.get('/hosted', getHostedDebates);
router.get('/participated', getParticipatedDebates);
router.post('/:id/join', joinDebate);
router.post('/:id/leave', leaveDebate);
router.patch('/:id/status', updateDebateStatus);

export default router;
