import express from 'express';
import { getAdminStats, getPendingMerchants, approveMerchant } from '../controllers/adminController';
// import { authenticateToken } from '../middleware/auth'; 
// For MVP demo, skipping auth middleware on admin routes to make it easier to access from Web without login flow
// In production, UNCOMMENT authenticateToken

const router = express.Router();

router.get('/stats', getAdminStats);
router.get('/merchants/pending', getPendingMerchants);
router.post('/merchants/approve', approveMerchant);

export default router;
