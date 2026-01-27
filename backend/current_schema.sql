--
-- PostgreSQL database dump
--

\restrict BrVcTCDQHnkjansh3vBJUeYcTtdHhHFQ23dsNWMG16a8yrFrbLMa8kTpNAOC9Ev

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: DocType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DocType" AS ENUM (
    'PAN',
    'GST',
    'BANK_PROOF',
    'ADDRESS_PROOF',
    'OTHER'
);


ALTER TYPE public."DocType" OWNER TO postgres;

--
-- Name: EntityType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EntityType" AS ENUM (
    'PLATFORM',
    'MERCHANT',
    'CUSTOMER'
);


ALTER TYPE public."EntityType" OWNER TO postgres;

--
-- Name: KycStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."KycStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'NEEDS_CLARIFICATION'
);


ALTER TYPE public."KycStatus" OWNER TO postgres;

--
-- Name: LedgerType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LedgerType" AS ENUM (
    'COMMISSION',
    'SETTLEMENT',
    'COIN_ISSUANCE',
    'COIN_REDEMPTION',
    'PAYMENT_RECEIVED'
);


ALTER TYPE public."LedgerType" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'CUSTOMER',
    'MERCHANT',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: TxnStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TxnStatus" AS ENUM (
    'CREATED',
    'INITIATED',
    'SUCCESS',
    'FAILED',
    'SETTLED'
);


ALTER TYPE public."TxnStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    user_id text NOT NULL,
    full_name text NOT NULL,
    email text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: kyc_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kyc_documents (
    id text DEFAULT public.uuid_generate_v4() NOT NULL,
    merchant_id text NOT NULL,
    doc_type public."DocType" NOT NULL,
    file_url text NOT NULL,
    status public."KycStatus" DEFAULT 'PENDING'::public."KycStatus" NOT NULL,
    admin_note text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.kyc_documents OWNER TO postgres;

--
-- Name: ledger_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ledger_entries (
    id text DEFAULT public.uuid_generate_v4() NOT NULL,
    transaction_id text NOT NULL,
    entity_type public."EntityType" NOT NULL,
    entity_id text NOT NULL,
    debit numeric(10,2) DEFAULT 0 NOT NULL,
    credit numeric(10,2) DEFAULT 0 NOT NULL,
    type public."LedgerType" NOT NULL,
    balance_snapshot numeric(14,2),
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.ledger_entries OWNER TO postgres;

--
-- Name: merchants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.merchants (
    user_id text NOT NULL,
    business_name text NOT NULL,
    commission_rate numeric(5,2) NOT NULL,
    max_reward_cap numeric(5,2) DEFAULT 10.00 NOT NULL,
    kyc_status public."KycStatus" DEFAULT 'PENDING'::public."KycStatus" NOT NULL,
    razorpay_account_id text,
    is_onboarding_complete boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    pan_number character varying(20),
    gstin character varying(20),
    bank_account_number character varying(50),
    ifsc_code character varying(15),
    account_holder_name character varying(100),
    business_type character varying(50) DEFAULT 'PROPRIETORSHIP'::character varying,
    doc_pan_url text,
    doc_business_proof_url text,
    doc_bank_proof_url text
);


ALTER TABLE public.merchants OWNER TO postgres;

--
-- Name: momo_coins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.momo_coins (
    customer_id text NOT NULL,
    balance_available integer DEFAULT 0 NOT NULL,
    balance_pending integer DEFAULT 0 NOT NULL,
    lifetime_earned integer DEFAULT 0 NOT NULL,
    lifetime_redeemed integer DEFAULT 0 NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.momo_coins OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id text DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id text NOT NULL,
    token text NOT NULL,
    device_id text,
    expires_at timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id text DEFAULT public.uuid_generate_v4() NOT NULL,
    razorpay_order_id text NOT NULL,
    merchant_id text NOT NULL,
    customer_id text NOT NULL,
    amount_gross numeric(10,2) NOT NULL,
    amount_net numeric(10,2) NOT NULL,
    coins_redeemed integer DEFAULT 0 NOT NULL,
    coins_earned integer DEFAULT 0 NOT NULL,
    commission_rate numeric(5,2) NOT NULL,
    random_reward_pct numeric(5,2) NOT NULL,
    commission_amount numeric(10,2) NOT NULL,
    status public."TxnStatus" DEFAULT 'CREATED'::public."TxnStatus" NOT NULL,
    failure_reason text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text DEFAULT public.uuid_generate_v4() NOT NULL,
    mobile text NOT NULL,
    role public."Role" NOT NULL,
    pin_hash text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    full_name character varying(255),
    email character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (user_id);


--
-- Name: kyc_documents kyc_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kyc_documents
    ADD CONSTRAINT kyc_documents_pkey PRIMARY KEY (id);


--
-- Name: ledger_entries ledger_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ledger_entries
    ADD CONSTRAINT ledger_entries_pkey PRIMARY KEY (id);


--
-- Name: merchants merchants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_pkey PRIMARY KEY (user_id);


--
-- Name: momo_coins momo_coins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.momo_coins
    ADD CONSTRAINT momo_coins_pkey PRIMARY KEY (customer_id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: ledger_entries_entity_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ledger_entries_entity_id_idx ON public.ledger_entries USING btree (entity_id);


--
-- Name: ledger_entries_transaction_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ledger_entries_transaction_id_idx ON public.ledger_entries USING btree (transaction_id);


--
-- Name: sessions_token_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX sessions_token_key ON public.sessions USING btree (token);


--
-- Name: transactions_customer_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_customer_id_idx ON public.transactions USING btree (customer_id);


--
-- Name: transactions_merchant_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_merchant_id_idx ON public.transactions USING btree (merchant_id);


--
-- Name: transactions_razorpay_order_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX transactions_razorpay_order_id_key ON public.transactions USING btree (razorpay_order_id);


--
-- Name: users_mobile_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_mobile_key ON public.users USING btree (mobile);


--
-- Name: customers customers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: kyc_documents kyc_documents_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kyc_documents
    ADD CONSTRAINT kyc_documents_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ledger_entries ledger_entries_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ledger_entries
    ADD CONSTRAINT ledger_entries_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: merchants merchants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: momo_coins momo_coins_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.momo_coins
    ADD CONSTRAINT momo_coins_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: transactions transactions_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict BrVcTCDQHnkjansh3vBJUeYcTtdHhHFQ23dsNWMG16a8yrFrbLMa8kTpNAOC9Ev

