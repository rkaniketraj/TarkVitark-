
import { Router } from 'express';
import {
    getActiveDebates,
    getUpcomingDebates,
    getDebateDetails,
    createDebate,
    getHostedDebates,
    getParticipatedDebates,
    joinDebate,
    leaveDebate,
    updateDebateStatus
} from '../controllers/discussion.controller.js';
import { registerForDebate } from '../controllers/debate.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createDebateRoom } from '../controllers/debateRoom.controller.js';

const router = Router();

// Public routes
router.get('/active', getActiveDebates);
router.get('/upcoming', getUpcomingDebates);
router.get('/:id', getDebateDetails);

// Protected routes
router.use(verifyJWT); // Apply authentication middleware to all routes below

// Debate registration
router.post('/register', registerForDebate);

// Debate Room creation (protected)
router.post('/debate-room', createDebateRoom);

// // Register for a debate (protected)
// router.post('/register', verifyJWT, registerForDebate);

export default router;
