-- 1. ADD 'SALES' Role to Enum
ALTER TYPE public."Role" ADD VALUE IF NOT EXISTS 'SALES';

-- 2. ENHANCE 'merchants' for Attribution & Geo-location
ALTER TABLE public.merchants 
ADD COLUMN IF NOT EXISTS onboarded_by uuid REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS referral_code_used text,
ADD COLUMN IF NOT EXISTS onboarding_lat double precision,
ADD COLUMN IF NOT EXISTS onboarding_long double precision;

-- 3. ENHANCE 'users' for Sales Metadata (Hierarchy, Employee ID)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- 4. CREATE INDEX for Performance
CREATE INDEX IF NOT EXISTS idx_merchants_onboarded_by ON public.merchants(onboarded_by);
