import express from 'express';
import { calculatePayment, initiatePayment, handleWebhook } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/calculate', authenticateToken, calculatePayment);
router.post('/initiate', authenticateToken, initiatePayment);
router.post('/webhook', handleWebhook); // No auth, signature verified inside

export default router;
