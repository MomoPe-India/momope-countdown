import express from 'express';
import { sendOtp, verifyOtp, setPin, verifyPin, loginWithPin } from '../controllers/authController';

const router = express.Router();

router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtp);
router.post('/pin/login', loginWithPin);
router.post('/pin/set', setPin);
router.post('/pin/verify', verifyPin);

export default router;
