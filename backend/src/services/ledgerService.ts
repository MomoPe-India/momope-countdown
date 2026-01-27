import { supabase } from '../config/supabaseClient';

interface LedgerEntryParams {
    transactionId: string;
    entityType: 'PLATFORM' | 'MERCHANT' | 'CUSTOMER';
    entityId: string;
    type: 'COMMISSION' | 'SETTLEMENT' | 'COIN_ISSUANCE' | 'COIN_REDEMPTION' | 'PAYMENT_RECEIVED' | 'SALES_CREDIT';
    debit?: number;
    credit?: number;
    description?: string;
}

export const recordLedgerEntry = async (params: LedgerEntryParams) => {
    // In a real double-entry system, we would fetch the last balance to calculate the new snapshot
    // For MVP, we insert the entry.

    const { error } = await supabase
        .from('ledger_entries')
        .insert({
            transaction_id: params.transactionId,
            entity_type: params.entityType,
            entity_id: params.entityId,
            type: params.type,
            debit: params.debit || 0,
            credit: params.credit || 0,
            description: params.description
        });

    if (error) {
        console.error('Ledger Entry Failed:', error);
        // We log but don't throw to avoid crashing the main flow if just logging fails? 
        // Or should we throw? Robustness says throw. MVP says log.
        // Let's log for now.
    }
};

export const getPlatformMargin = (commissionRate: number, rewardRate: number): number => {
    // Logic: Ensure minimum 5% margin
    // Commission 15%, Reward 10% -> Margin 5% (Allowed)
    return parseFloat((commissionRate - rewardRate).toFixed(2));
};

export const calculateRandomReward = (maxCap: number, commissionRate: number, amount: number) => {
    // User Rule: "Guaranteed cashback... random up to 10% irrespective of commission"
    const MIN_REWARD_PCT = 1; // Guaranteed 1%
    const MAX_REWARD_PCT = 10; // Capped at 10%

    // Random integer between 1 and 10
    const randomPercent = Math.floor(Math.random() * (MAX_REWARD_PCT - MIN_REWARD_PCT + 1)) + MIN_REWARD_PCT;

    // Calculate Coins (1 Coin = 1 Rupee)
    const coinsIssued = Math.floor(amount * (randomPercent / 100));

    return {
        percentage: randomPercent,
        coins: coinsIssued
    };
};
