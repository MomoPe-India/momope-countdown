import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { AuthRequest } from '../middleware/auth';

export const getCustomerProfile = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== 'CUSTOMER') return res.sendStatus(403);

    const userId = req.user.userId;

    // Join with users
    const { data, error } = await supabase
        .from('customers')
        .select('*, users (pin_hash)')
        .eq('user_id', userId)
        .maybeSingle();

    const { data: coins } = await supabase
        .from('momo_coins')
        .select('*')
        .eq('customer_id', userId)
        .maybeSingle();

    if (error) {
        return res.status(500).json({ error: 'Database error' });
    }

    if (!data) {
        return res.json({ profile: null, coins: { balance_available: 0 } });
    }

    const flatProfile = {
        ...data,
        is_pin_set: !!(data.users as any)?.pin_hash,
        onboarding_step: (data.full_name && data.full_name !== 'New Customer') ? 'COMPLETED' : 'REGISTRATION'
    };

    res.json({
        profile: flatProfile,
        coins: coins || { balance_available: 0 }
    });
};

export const createCustomerProfile = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== 'CUSTOMER') return res.sendStatus(403);

    const { full_name, email } = req.body;
    const userId = req.user.userId;

    try {
        console.log(`[CUSTOMER_UPDATE] Saving profile for UserID: ${userId}`);
        console.log(`[CUSTOMER_UPDATE] Payload:`, { full_name, email });

        // Update Customer (Row is guaranteed to exist from verifyOtp)
        // Update Customer (Row is guaranteed to exist from verifyOtp)
        const { error } = await supabase
            .from('customers')
            .update({
                full_name,
                email
            })
            .eq('user_id', userId);

        if (error) {
            console.error('[CUSTOMER_UPDATE] Supabase Error:', error);
            throw error;
        }

        console.log(`[CUSTOMER_UPDATE] Profile saved.`);

        // Initialize Coin Wallet explicitly if not exists (upsert with ignore matches)
        // Check if exists first to avoid resetting if we had logic (but upsert is safe usually)
        // ON CONFLICT DO NOTHING equivalent: 
        const { error: coinError } = await supabase
            .from('momo_coins')
            .upsert({ customer_id: userId }, { onConflict: 'customer_id', ignoreDuplicates: true });

        if (coinError) throw coinError;

        res.json({ message: 'Profile saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save profile' });
    }
};
