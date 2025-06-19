import { Router } from 'express';
import { getMessagesForDebate, sendMessage } from '../controllers/message.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// All message routes require authentication
router.use(verifyJWT);

// Get all messages for a debate
router.get('/debate/:debateId', getMessagesForDebate);
// Send a message to a debate
router.post('/debate/:debateId', sendMessage);

export default router;
