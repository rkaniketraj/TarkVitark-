import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetail,
  updateUserAvatar,
  getUserChannelProfile,
  getPastParticipatedDebates,
  getHostedDebateRooms
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { multerUploads } from '../middlewares/multer.middleware.js';

const router = Router();

// Public routes
router.post('/register', multerUploads, registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshAccessToken);

// Protected routes
router.use(verifyJWT);
router.post('/logout', logoutUser);
router.post('/change-password', changeCurrentPassword);
router.get('/current', getCurrentUser);
router.patch('/update', updateAccountDetail);
router.patch('/avatar', multerUploads, updateUserAvatar);
router.get('/profile/:username', getUserChannelProfile);
router.get('/participated', getPastParticipatedDebates);
router.get('/hosted', getHostedDebateRooms);

export default router;
