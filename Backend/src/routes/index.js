import { Router } from 'express';
import debateRouter from './debate.routes.js';
import messageRouter from './message.routes.js';
import voteRouter from './vote.routes.js';
import userRouter from './user.routes.js';
import paymentRouter from './payment.routes.js';
import discussionRouter from './discussion.routes.js';

const router = Router();

router.use('/debates', debateRouter);
router.use('/debates/messages', messageRouter);
router.use('/debates/votes', voteRouter);
router.use('/discussions', discussionRouter);
router.use('/users', userRouter);
router.use('/payments', paymentRouter);

// Health check route
// router.get("/health", (req, res) => {
//   res.status(200).json({ status: "ok" });
// });


export default router;
