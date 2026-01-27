-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Enums
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'MERCHANT', 'ADMIN');
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'NEEDS_CLARIFICATION');
CREATE TYPE "DocType" AS ENUM ('PAN', 'GST', 'BANK_PROOF', 'ADDRESS_PROOF', 'OTHER');
CREATE TYPE "TxnStatus" AS ENUM ('CREATED', 'INITIATED', 'SUCCESS', 'FAILED', 'SETTLED');
CREATE TYPE "EntityType" AS ENUM ('PLATFORM', 'MERCHANT', 'CUSTOMER');
CREATE TYPE "LedgerType" AS ENUM ('COMMISSION', 'SETTLEMENT', 'COIN_ISSUANCE', 'COIN_REDEMPTION', 'PAYMENT_RECEIVED');

-- 2. Create Users Table
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "mobile" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "pin_hash" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_mobile_key" ON "users"("mobile");

-- 3. Create Sessions Table
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "device_id" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 4. Create Merchants Table
CREATE TABLE "merchants" (
    "user_id" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "commission_rate" DECIMAL(5,2) NOT NULL,
    "max_reward_cap" DECIMAL(5,2) NOT NULL DEFAULT 10.00,
    "kyc_status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "razorpay_account_id" TEXT,
    "is_onboarding_complete" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "merchants_pkey" PRIMARY KEY ("user_id")
);
ALTER TABLE "merchants" ADD CONSTRAINT "merchants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 5. Create Customers Table
CREATE TABLE "customers" (
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "customers_pkey" PRIMARY KEY ("user_id")
);
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 6. Create KYC Documents Table
CREATE TABLE "kyc_documents" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "merchant_id" TEXT NOT NULL,
    "doc_type" "DocType" NOT NULL,
    "file_url" TEXT NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "admin_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "kyc_documents_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "kyc_documents" ADD CONSTRAINT "kyc_documents_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 7. Create Transactions Table
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "razorpay_order_id" TEXT NOT NULL,
    "merchant_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "amount_gross" DECIMAL(10,2) NOT NULL,
    "amount_net" DECIMAL(10,2) NOT NULL,
    "coins_redeemed" INTEGER NOT NULL DEFAULT 0,
    "coins_earned" INTEGER NOT NULL DEFAULT 0,
    "commission_rate" DECIMAL(5,2) NOT NULL,
    "random_reward_pct" DECIMAL(5,2) NOT NULL,
    "commission_amount" DECIMAL(10,2) NOT NULL,
    "status" "TxnStatus" NOT NULL DEFAULT 'CREATED',
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "transactions_razorpay_order_id_key" ON "transactions"("razorpay_order_id");
CREATE INDEX "transactions_merchant_id_idx" ON "transactions"("merchant_id");
CREATE INDEX "transactions_customer_id_idx" ON "transactions"("customer_id");
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 8. Create MomoCoins Table
CREATE TABLE "momo_coins" (
    "customer_id" TEXT NOT NULL,
    "balance_available" INTEGER NOT NULL DEFAULT 0,
    "balance_pending" INTEGER NOT NULL DEFAULT 0,
    "lifetime_earned" INTEGER NOT NULL DEFAULT 0,
    "lifetime_redeemed" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "momo_coins_pkey" PRIMARY KEY ("customer_id")
);
ALTER TABLE "momo_coins" ADD CONSTRAINT "momo_coins_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- 9. Create Ledger Entries Table
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),
    "transaction_id" TEXT NOT NULL,
    "entity_type" "EntityType" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "debit" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "credit" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "type" "LedgerType" NOT NULL,
    "balance_snapshot" DECIMAL(14,2),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ledger_entries_entity_id_idx" ON "ledger_entries"("entity_id");
CREATE INDEX "ledger_entries_transaction_id_idx" ON "ledger_entries"("transaction_id");
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
