import express from 'express';
import { signup, login, logout, getMe } from '../controllers/authController.js'; //import a controllers
import  productor  from '../middleware/productor.js'; //import productor

// Use a router using express
const router = express.Router();

// Route for authentication
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', productor, getMe);

export default router;
