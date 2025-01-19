import express from 'express';
import productor from '../middleware/productor.js';
import { getProfile, updateUser} from '../controllers/userController.js'

const router = express.Router();

// Route for users deatils
router.get('/profile/:username', productor, getProfile);
router.post('/update', productor, updateUser);

export default router;