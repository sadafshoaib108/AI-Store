-- ===================================================
-- Seed Physical Products
-- ===================================================
-- Replaces existing demo/digital products with
-- realistic physical product catalog.
--
-- Run this in the Supabase SQL Editor or via CLI.
-- ===================================================

-- Remove existing demo/digital products
DELETE FROM public.products
WHERE category IN (
  'AI Tools',
  'Business',
  'Marketing',
  'Productivity',
  'Audio',
  'Accessories',
  'Wearables'
);

-- Insert physical products
INSERT INTO public.products (name, description, price, category, image_url, is_active)
VALUES
  (
    'Classic Cotton T-Shirt',
    'Comfortable premium cotton t-shirt suitable for everyday wear.',
    2499,
    'Clothing',
    'https://placehold.co/600x400/EEE/31343C?text=Classic+Cotton+T-Shirt',
    true
  ),
  (
    'Urban Casual Hoodie',
    'Soft and comfortable casual hoodie for everyday use.',
    4499,
    'Clothing',
    'https://placehold.co/600x400/EEE/31343C?text=Urban+Casual+Hoodie',
    true
  ),
  (
    'Wireless Bluetooth Headphones',
    'Comfortable wireless headphones with clear audio and long battery life.',
    5999,
    'Electronics',
    'https://placehold.co/600x400/EEE/31343C?text=Wireless+Bluetooth+Headphones',
    true
  ),
  (
    'Smart LED Desk Lamp',
    'Modern LED desk lamp with adjustable brightness for work and study.',
    3299,
    'Home & Office',
    'https://placehold.co/600x400/EEE/31343C?text=Smart+LED+Desk+Lamp',
    true
  ),
  (
    'Minimal Leather Wallet',
    'Slim everyday wallet with a clean and durable design.',
    1999,
    'Accessories',
    'https://placehold.co/600x400/EEE/31343C?text=Minimal+Leather+Wallet',
    true
  ),
  (
    'Everyday Canvas Backpack',
    'Durable lightweight backpack suitable for work, university, and travel.',
    3999,
    'Bags',
    'https://placehold.co/600x400/EEE/31343C?text=Everyday+Canvas+Backpack',
    true
  ),
  (
    'Stainless Steel Water Bottle',
    'Reusable stainless steel bottle designed for everyday use.',
    2299,
    'Home & Lifestyle',
    'https://placehold.co/600x400/EEE/31343C?text=Stainless+Steel+Water+Bottle',
    true
  ),
  (
    'Wireless Charging Pad',
    'Compact wireless charging pad for compatible smartphones and devices.',
    2799,
    'Electronics',
    'https://placehold.co/600x400/EEE/31343C?text=Wireless+Charging+Pad',
    true
  );
