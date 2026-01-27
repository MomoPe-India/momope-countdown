import express from 'express';
import { getCustomerProfile, createCustomerProfile } from '../controllers/customerController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/profile', authenticateToken, getCustomerProfile);
router.post('/profile', authenticateToken, createCustomerProfile);

export default router;
