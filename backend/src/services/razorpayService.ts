import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize with dummy keys if not provided (Test Mode)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (amountInPaise: number, receiptId: string, notes: any) => {
    try {
        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: receiptId,
            notes: notes,
            payment_capture: 1, // Auto capture
        };

        // In strict test mode without real keys, this would fail.
        // For local dev without keys, we might need to mock this call if using placeholders.
        if (RAZORPAY_KEY_ID === 'rzp_test_placeholder') {
            console.warn('USING MOCK RAZORPAY ORDER GENERATION');
            return Promise.resolve({
                id: `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                entity: 'order',
                amount: amountInPaise,
                amount_paid: 0,
                amount_due: amountInPaise,
                currency: 'INR',
                receipt: receiptId,
                status: 'created',
                attempts: 0,
                notes: notes ? notes : {},
                created_at: Math.floor(Date.now() / 1000)
            });
        }

        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        console.error('Razorpay Order Creation Failed:', error);
        throw error;
    }
};

export const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string) => {
    const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(orderId + '|' + paymentId)
        .digest('hex');

    return generatedSignature === signature;
};

export const validateWebhookSignature = (body: string, signature: string) => {
    const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

    return generatedSignature === signature;
};
