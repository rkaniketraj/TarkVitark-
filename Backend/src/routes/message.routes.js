import { Router } from 'express';
// --- CORRECTION: Removed 'sendMessage' from the import ---
import { getMessagesForDebate } from '../controllers/message.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// All message routes require authentication
router.use(verifyJWT);

// Route to get all messages for a specific debate
router.get('/:debateId', getMessagesForDebate);

// --- CORRECTION: Removed the unused POST route ---

export default router;