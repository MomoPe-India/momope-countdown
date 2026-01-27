import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { AuthRequest } from '../middleware/auth';

export const getMerchantProfile = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== 'MERCHANT') return res.sendStatus(403);

    const userId = req.user.userId;

    // Join with users table
    // Assuming 'users' is the linked resource for user_id FK
    const { data, error } = await supabase
        .from('merchants')
        .select('*, users (full_name, email, pin_hash)')
        .eq('user_id', userId)
        .single();

    if (error) {
        // If not found, data is null. 
        if (error.code === 'PGRST116') { // Message: JSON object requested, multiple (or no) rows returned
            return res.json({ profile: null, onboarding_step: 'REGISTRATION' });
        }
        console.error('Get Profile Error:', error);
        return res.status(500).json({ error: 'Failed to fetch profile' });
    }

    const profile = data;

    // Flatten the user data if needed or frontend expects it at top level?
    // The previous SQL returned `full_name` at top level.
    // PostgREST returns `users: { full_name: ... }`.
    // We should map it to maintain compatibility.
    const flatProfile = {
        ...profile,
        full_name: profile.users?.full_name,
        email: profile.users?.email,
        is_pin_set: !!profile.users?.pin_hash // Fetch pin_hash? We need to select it
    };

    // We need to fetch pin_hash to determine is_pin_set. 
    // Let's modify the select query above to include pin_hash in users join.
    // Retrying with corrected select below.

    if (!profile.is_onboarding_complete) {
        return res.json({ profile: flatProfile, onboarding_step: 'REGISTRATION' });
    }

    res.json({ profile: flatProfile, onboarding_step: 'COMPLETED' });
};

// Re-implementing with correct select structure separately to avoid mess
const getMerchantProfileImpl = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== 'MERCHANT') return res.sendStatus(403);
    const userId = req.user.userId;

    const { data, error } = await supabase
        .from('merchants')
        .select('*, users (full_name, email, pin_hash)')
        .eq('user_id', userId)
        .maybeSingle(); // Better than single() to handle null

    if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Database error' });
    }

    if (!data) {
        return res.json({ profile: null, onboarding_step: 'REGISTRATION' });
    }

    const flatProfile = {
        ...data,
        full_name: (data.users as any)?.full_name,
        email: (data.users as any)?.email,
        is_pin_set: !!(data.users as any)?.pin_hash
    };

    if (!data.is_onboarding_complete) {
        return res.json({ profile: flatProfile, onboarding_step: 'REGISTRATION' });
    }
    return res.json({ profile: flatProfile, onboarding_step: 'COMPLETED' });
}

export const createMerchantProfile = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== 'MERCHANT') return res.sendStatus(403);

    const { business_name, commission_rate, max_reward_cap, full_name, email } = req.body;
    const userId = req.user.userId;

    if (commission_rate && (commission_rate < 10 || commission_rate > 50)) {
        return res.status(400).json({ error: 'Commission must be between 10% and 50%' });
    }

    if (!full_name || !email || !business_name) {
        return res.status(400).json({ error: 'Business Name, Owner Name and Email are mandatory' });
    }

    // Sequential Updates (No Transaction)
    // 1. Update User
    const { error: userError } = await supabase
        .from('users')
        .update({ full_name, email })
        .eq('id', userId);

    if (userError) {
        console.error('Update User Failed:', userError);
        return res.status(500).json({ error: 'Failed to update user info' });
    }

    // 2. Update Merchant
    const finalCommission = commission_rate || 15.00;
    const finalRewardCap = max_reward_cap || 100.00;

    const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .update({
            business_name,
            commission_rate: finalCommission,
            max_reward_cap: finalRewardCap,
            is_onboarding_complete: true,
            updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

    if (merchantError) {
        console.error('Update Merchant Failed:', merchantError);
        // In a real transaciton we would rollback user here.
        return res.status(500).json({ error: 'Failed to update merchant profile' });
    }

    const combinedProfile = {
        ...merchantData,
        full_name,
        email
    };

    res.json({ message: 'Profile updated', profile: combinedProfile });
};

export const getMerchantHistory = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== 'MERCHANT') return res.sendStatus(403);
    const userId = req.user.userId;

    // Join transactions with customers
    // 'customers' relation needs to be accessible via transactions.customer_id
    const { data, error } = await supabase
        .from('transactions')
        .select('id, amount_net, created_at, status, customers (full_name)')
        .eq('merchant_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('History Error:', error);
        return res.status(500).json({ error: 'Failed to fetch history' });
    }

    // Flatten logic if needed by frontend
    const flatData = data.map((t: any) => ({
        ...t,
        full_name: t.customers?.full_name
    }));

    res.json(flatData);
};

export const submitKyc = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== 'MERCHANT') return res.sendStatus(403);

    const {
        pan_number, gstin, bank_account_number, ifsc_code,
        account_holder_name, business_type, commission_rate
    } = req.body;
    const userId = req.user.userId;

    if (!pan_number || !bank_account_number || !ifsc_code || !account_holder_name) {
        return res.status(400).json({ error: 'Missing mandatory KYC fields' });
    }

    const updates: any = {
        pan_number, gstin, bank_account_number, ifsc_code,
        account_holder_name, business_type,
        kyc_status: 'PENDING',
        updated_at: new Date().toISOString()
    };
    if (commission_rate) updates.commission_rate = commission_rate;

    const { data, error } = await supabase
        .from('merchants')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        console.error('KYC Error:', error);
        return res.status(500).json({ error: 'Failed to submit KYC' });
    }

    res.json({ message: 'KYC Submitted Successfully', profile: data });
};

export const uploadLogo = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const file = req.file;

        if (!userId || !file) {
            return res.status(400).json({ error: 'Missing user or file' });
        }

        const filePath = `${userId}/${Date.now()}_logo.png`;

        const { error: uploadError } = await supabase.storage
            .from('merchants')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: true
            });

        if (uploadError) {
            console.error('Supabase Upload Error:', uploadError);
            return res.status(500).json({ error: 'Failed to upload image to cloud storage' });
        }

        const { data: publicUrlData } = supabase.storage
            .from('merchants')
            .getPublicUrl(filePath);
        const publicUrl = publicUrlData.publicUrl;

        const { data: updatedMerchant, error: dbError } = await supabase
            .from('merchants')
            .update({ profile_picture_url: publicUrl })
            .eq('user_id', userId)
            .select('profile_picture_url')
            .single();

        if (dbError) {
            console.error('DB Update Error:', dbError);
            return res.status(500).json({ error: 'Database update failed' });
        }

        res.json({
            success: true,
            logo_url: publicUrl,
            message: 'Logo uploaded successfully'
        });

    } catch (error) {
        console.error('Upload Logo Exception:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getMerchantStats = async (req: AuthRequest, res: Response) => {
    if (!req.user || req.user.role !== 'MERCHANT') return res.sendStatus(403);
    const userId = req.user.userId;

    try {
        // 1. Fetch Wallet Balance (Momo Coins)
        // Merchants also have a coin wallet record.
        const { data: wallet } = await supabase
            .from('momo_coins')
            .select('balance_available')
            .eq('customer_id', userId) // Merchant's userId is used as customer_id in coins table
            .maybeSingle();

        // 2. Fetch Transactions (Success only)
        const { data: transactions, error } = await supabase
            .from('transactions')
            .select('amount_net, created_at')
            .eq('merchant_id', userId)
            .eq('status', 'success')
            .order('created_at', { ascending: true }); // Ascending for chart

        if (error) throw error;

        // 3. Process Data
        const todayStr = new Date().toISOString().split('T')[0];
        let totalVolume = 0;
        let todayVolume = 0;
        const dailyMap = new Map();

        // Initialize last 7 days with 0
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            dailyMap.set(dateKey, 0);
        }

        transactions?.forEach(tx => {
            const dateKey = new Date(tx.created_at).toISOString().split('T')[0];
            const amount = Number(tx.amount_net) || 0;
            totalVolume += amount;

            if (dateKey === todayStr) {
                todayVolume += amount;
            }

            // Only map if it's within our tracked window (or just map everything and slice later if strictly needed)
            if (dailyMap.has(dateKey)) {
                dailyMap.set(dateKey, dailyMap.get(dateKey) + amount);
            }
        });

        // Convert Map to Array for Chart
        const chartData = Array.from(dailyMap.entries()).map(([date, amount]) => ({
            date: new Date(date).toLocaleDateString(undefined, { weekday: 'short' }), // e.g. "Mon"
            fullDate: date,
            amount
        }));

        res.json({
            balance: wallet?.balance_available || 0,
            total_volume: totalVolume,
            today_volume: todayVolume,
            transaction_count: transactions?.length || 0,
            chart_data: chartData
        });

    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch Merchant Stats' });
    }
};


