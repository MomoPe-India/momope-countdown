import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';
import merchantRoutes from './routes/merchantRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/customer', customerRoutes);
app.use('/merchant', merchantRoutes);
app.use('/payment', paymentRoutes);
app.use('/admin', adminRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
