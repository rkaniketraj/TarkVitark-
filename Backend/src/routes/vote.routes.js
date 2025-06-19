import { Router } from 'express';
import { voteOnDebate, getDebateResults } from '../controllers/discussion.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route for results
router.get('/:id/results', getDebateResults);

// Protected route for voting
router.use(verifyJWT);
router.post('/:id/vote', voteOnDebate);

export default router;
