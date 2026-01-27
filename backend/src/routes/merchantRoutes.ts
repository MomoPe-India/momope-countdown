import express from 'express';
import { getMerchantProfile, createMerchantProfile, getMerchantHistory, submitKyc, uploadLogo, getMerchantStats } from '../controllers/merchantController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router.get('/profile', authenticateToken, getMerchantProfile);
router.post('/onboard', authenticateToken, createMerchantProfile);
router.get('/history', authenticateToken, getMerchantHistory);
router.post('/kyc', authenticateToken, submitKyc);
router.post('/upload-logo', authenticateToken, upload.single('logo'), uploadLogo);
router.get('/stats', authenticateToken, getMerchantStats);

export default router;
