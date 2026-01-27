-- Enable RLS on Core Tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- 1. Policies for USERS Table
-- -------------------------------------------------------------

-- Policy: Users can see their own profile
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- -------------------------------------------------------------
-- 2. Policies for MERCHANTS Table
-- -------------------------------------------------------------

-- Policy: Anyone (Authenticated) can view Merchants (required for 'Scan QR' to find payee)
-- We might want to restrict this to only 'business_name' and 'id' later, but for now we trust auth users.
CREATE POLICY "Authenticated users can view all merchants"
ON merchants FOR SELECT
TO authenticated
USING (true);

-- Policy: Only the Merchant Owner can update their store details
CREATE POLICY "Merchants can update own store"
ON merchants FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- -------------------------------------------------------------
-- 3. Policies for TRANSACTIONS Table
-- -------------------------------------------------------------

-- Policy: Users can see transactions where they are the Customer or the Merchant
CREATE POLICY "Users view their own transactions"
ON transactions FOR SELECT
TO authenticated
USING (
    customer_id = auth.uid() OR 
    merchant_id = auth.uid()
);

-- Policy: Authenticated users can insert transactions
CREATE POLICY "Users can create transactions"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (
    -- Ensure the user creating the transaction is the customer (payer)
    auth.uid() = customer_id
); 

-- -------------------------------------------------------------
-- 4. Policies for LEDGER_ENTRIES Table
-- -------------------------------------------------------------
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own ledger"
ON ledger_entries FOR SELECT
TO authenticated
USING (
    -- entity_id is stored as TEXT in the schema, so we cast auth.uid() to text
    entity_id = auth.uid()::text
);
