import { Response } from 'express';
import { supabase } from '../config/supabaseClient';
import { AuthRequest } from '../middleware/auth';

export const getAdminStats = async (req: AuthRequest, res: Response) => {
    try {
        const { count: merchantCount } = await supabase
            .from('merchants')
            .select('*', { count: 'exact', head: true });

        const { count: userCount } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        // Revenue: Sum commission_amount from transactions where status = 'SUCCESS'
        // Supabase doesn't have a direct .sum() builder method easily without RPC for aggregation usually.
        // It returns data. We might need to fetch fields and sum in JS if volume is low, OR use .rpc() if we had one.
        // For MVP with low volume, fetching 'commission_amount' is okay.

        const { data: revenueData } = await supabase
            .from('transactions')
            .select('commission_amount')
            .eq('status', 'SUCCESS');

        const revenue = revenueData ? revenueData.reduce((acc, curr) => acc + (curr.commission_amount || 0), 0) : 0;

        const { count: pendingKyc } = await supabase
            .from('merchants')
            .select('*', { count: 'exact', head: true })
            .eq('kyc_status', 'PENDING');

        res.json({
            totalMerchants: merchantCount || 0,
            totalUsers: userCount || 0,
            platformRevenue: revenue,
            pendingKyc: pendingKyc || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

export const getPendingMerchants = async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('merchants')
            .select('user_id, business_name, created_at, users (mobile)')
            .eq('kyc_status', 'PENDING')
            .limit(10);

        if (error) throw error;

        // Flatten result
        const flatData = data.map((m: any) => ({
            ...m,
            mobile: m.users?.mobile
        }));

        res.json(flatData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch pending merchants' });
    }
};

export const approveMerchant = async (req: AuthRequest, res: Response) => {
    const { merchantId } = req.body;
    try {
        const { error } = await supabase
            .from('merchants')
            .update({ kyc_status: 'APPROVED' })
            .eq('user_id', merchantId);

        if (error) throw error;
        res.json({ message: 'Merchant Approved' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve merchant' });
    }
};
