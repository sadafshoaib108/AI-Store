-- ===================================================
-- AI Revenue Recovery - Initial Database Schema
-- ===================================================
-- This migration creates the foundational tables for:
-- - Store products
-- - Customers
-- - Orders
-- - Order items
-- - Revenue tracking (via orders)
-- - Future AI revenue recovery features
--
-- Run this in the Supabase SQL Editor or via CLI.
-- Do NOT expose any Supabase URL, anon key, or secrets.
-- ===================================================

-- ---------------------------------------------------
-- TABLE: products
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public read for active products
CREATE POLICY "products_read_active"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Authenticated users can insert/update (admin/role-based access to be refined later)
CREATE POLICY "products_auth_insert"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "products_auth_update"
  ON public.products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "products_auth_delete"
  ON public.products FOR DELETE
  TO authenticated
  USING (true);


-- ---------------------------------------------------
-- TABLE: customers
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers (email);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON public.customers (user_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trg_customers_updated_at ON public.customers;
CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read/update their own customer record
CREATE POLICY "customers_auth_read_own"
  ON public.customers FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "customers_auth_update_own"
  ON public.customers FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Allow insert during signup/checkout flow (to be refined with roles later)
CREATE POLICY "customers_auth_insert"
  ON public.customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Public read is intentionally disabled for customer privacy


-- ---------------------------------------------------
-- TABLE: orders
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  shipping NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders (payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trg_orders_updated_at ON public.orders;
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own orders
CREATE POLICY "orders_auth_read_own"
  ON public.orders FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
  ));

-- Authenticated users can create orders
CREATE POLICY "orders_auth_insert"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update their own orders
CREATE POLICY "orders_auth_update_own"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
  ))
  WITH CHECK (customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
  ));

-- Public/anon read is intentionally disabled


-- ---------------------------------------------------
-- TABLE: order_items
-- ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items (product_id);

-- RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read items for their own orders
CREATE POLICY "order_items_auth_read_own"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (order_id IN (
    SELECT o.id FROM public.orders o
    JOIN public.customers c ON c.id = o.customer_id
    WHERE c.user_id = auth.uid()
  ));

-- Authenticated users can insert items for their own orders
CREATE POLICY "order_items_auth_insert"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (order_id IN (
    SELECT o.id FROM public.orders o
    JOIN public.customers c ON c.id = o.customer_id
    WHERE c.user_id = auth.uid()
  ));

-- Public/anon read is intentionally disabled


-- ---------------------------------------------------
-- DEMO PRODUCTS
-- ---------------------------------------------------
-- These are development/demo products only.
-- They are not real business data.
-- ---------------------------------------------------

INSERT INTO public.products (name, description, price, category, is_active)
VALUES
  (
    'AI Marketing Toolkit',
    'Automate campaigns with AI-powered insights and analytics dashboards.',
    49.99,
    'AI Tools',
    true
  ),
  (
    'Business Analytics Dashboard',
    'Real-time metrics and KPIs in a single interactive dashboard.',
    99.99,
    'Business',
    true
  ),
  (
    'Social Media Content Pack',
    '50 professionally crafted templates for all major platforms.',
    29.99,
    'Marketing',
    true
  ),
  (
    'Productivity Planner',
    'Digital planner templates to organize your workflow and goals.',
    19.99,
    'Productivity',
    true
  ),
  (
    'Startup Growth Templates',
    'Pitch decks, financial models, and growth playbooks for founders.',
    79.99,
    'Business',
    true
  ),
  (
    'AI Prompt Library',
    'Curated prompts for marketing, copywriting, and productivity.',
    39.99,
    'AI Tools',
    true
  )
ON CONFLICT DO NOTHING;
