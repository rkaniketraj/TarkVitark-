import { Router } from 'express';
import { 
  getActiveDebates,
  getUpcomingDebates,
  registerForDebate,
  getDebateDetails,
  createDebate,
  getHostedDebates,
  getParticipatedDebates,
  getDebateMessages,
  sendMessage,
  joinDebate,
  leaveDebate,
  updateDebateStatus,
  voteOnDebate,
  getDebateResults
} from '../controllers/discussion.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.get('/active', getActiveDebates);
router.get('/upcoming', getUpcomingDebates);
router.get('/:id', getDebateDetails);
router.get('/:id/results', getDebateResults);

// Protected routes
router.use(verifyJWT);
router.post('/register', registerForDebate);
router.post('/create', createDebate);
router.get('/hosted', getHostedDebates);
router.get('/participated', getParticipatedDebates);

// Debate participation routes
router.post('/:id/join', joinDebate);
router.post('/:id/leave', leaveDebate);
router.post('/:id/vote', voteOnDebate);

// Debate messages routes
router.get('/:id/messages', getDebateMessages);
router.post('/:id/messages', sendMessage);

// Debate management routes (for debate hosts)
router.patch('/:id/status', updateDebateStatus);

export default router;
