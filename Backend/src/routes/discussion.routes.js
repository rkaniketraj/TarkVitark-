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

// Get current user's registration for a debate room
router.get('/:id/registration', verifyJWT, async (req, res) => {
  // :id is debate room id
  const debateId = req.params.id;
  const userId = req.user._id;
  try {
    const registration = await (await import('../models/debateRegistration.model.js')).default.findOne({
      debate: debateId,
      'participant.user': userId
    });
    if (!registration) {
      return res.status(404).json({ message: 'Not registered for this debate' });
    }
    res.json({ stance: registration.participant.stance });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch registration', error: err.message });
  }
});
router.get('/:id/messages', getDebateMessages);
router.post('/:id/messages', sendMessage);

// Debate management routes (for debate hosts)
router.patch('/:id/status', updateDebateStatus);

export default router;
