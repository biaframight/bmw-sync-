-- ═══════════════════════════════════════════════════════════════
-- Afrinza Marketplace — Supabase Initial Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- ─── Profiles (linked to Supabase Auth users) ────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  whatsapp    TEXT,
  location    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Auto-create a profile row when a user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Sellers ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sellers (
  id             SERIAL PRIMARY KEY,
  store_name     TEXT NOT NULL,
  owner_name     TEXT NOT NULL,
  description    TEXT,
  location       TEXT NOT NULL,
  categories     TEXT[] NOT NULL DEFAULT '{}',
  whatsapp       TEXT NOT NULL,
  avatar_url     TEXT,
  banner_url     TEXT,
  is_premium     BOOLEAN NOT NULL DEFAULT FALSE,
  rating         REAL NOT NULL DEFAULT 0,
  review_count   INTEGER NOT NULL DEFAULT 0,
  product_count  INTEGER NOT NULL DEFAULT 0,
  joined_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Products ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                SERIAL PRIMARY KEY,
  title             TEXT NOT NULL,
  description       TEXT,
  price             NUMERIC(10,2) NOT NULL,
  category          TEXT NOT NULL,
  location          TEXT NOT NULL,
  image_url         TEXT,
  images            TEXT[] NOT NULL DEFAULT '{}',
  seller_id         INTEGER NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  seller_name       TEXT NOT NULL,
  seller_whatsapp   TEXT NOT NULL,
  seller_avatar     TEXT,
  is_sponsored      BOOLEAN NOT NULL DEFAULT FALSE,
  is_premium_seller BOOLEAN NOT NULL DEFAULT FALSE,
  rating            REAL NOT NULL DEFAULT 0,
  review_count      INTEGER NOT NULL DEFAULT 0,
  stock             INTEGER NOT NULL DEFAULT 1,
  delivery_options  TEXT[] NOT NULL DEFAULT '{}',
  payment_methods   TEXT[] NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Cart Items ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id          SERIAL PRIMARY KEY,
  session_id  TEXT NOT NULL,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cart_items_session_id_idx ON cart_items(session_id);

-- ─── Orders ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  session_id       TEXT NOT NULL,
  buyer_name       TEXT NOT NULL,
  buyer_phone      TEXT NOT NULL,
  buyer_address    TEXT,
  total            NUMERIC(10,2) NOT NULL,
  payment_method   TEXT NOT NULL,
  delivery_method  TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Reviews ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  seller_id   INTEGER REFERENCES sellers(id) ON DELETE SET NULL,
  buyer_name  TEXT NOT NULL,
  rating      SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews(product_id);

-- ═══════════════════════════════════════════════════════════════
-- Row Level Security (RLS) — Phase 1: open read, anon write
-- Tighten these policies once auth is fully enabled.
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews    ENABLE ROW LEVEL SECURITY;

-- profiles: users manage their own row
CREATE POLICY IF NOT EXISTS "profiles: own row"
  ON profiles FOR ALL USING (auth.uid() = id);

-- sellers: public read, anon insert (Phase 1 — tighten later)
CREATE POLICY IF NOT EXISTS "sellers: public read"
  ON sellers FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "sellers: anon insert"
  ON sellers FOR INSERT WITH CHECK (true);

-- products: public read, anon insert
CREATE POLICY IF NOT EXISTS "products: public read"
  ON products FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "products: anon insert"
  ON products FOR INSERT WITH CHECK (true);

-- cart_items: full access (session-based, no auth)
CREATE POLICY IF NOT EXISTS "cart_items: full access"
  ON cart_items FOR ALL USING (true);

-- orders: anyone can insert
CREATE POLICY IF NOT EXISTS "orders: insert"
  ON orders FOR INSERT WITH CHECK (true);

-- reviews: public read, anon insert
CREATE POLICY IF NOT EXISTS "reviews: public read"
  ON reviews FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "reviews: anon insert"
  ON reviews FOR INSERT WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- Sample seed data — 2 sellers + 4 products (delete if not needed)
-- ═══════════════════════════════════════════════════════════════

INSERT INTO sellers (store_name, owner_name, description, location, categories, whatsapp, avatar_url, is_premium, rating, review_count, product_count)
VALUES
  ('Mama Ngozi Kitchen', 'Ngozi Adeyemi', 'Authentic Nigerian home cooking — Jollof rice, pepper soup, suya and more. Made fresh daily in Kuala Lumpur.', 'KL', ARRAY['Food','Catering'], '60173346205', 'https://api.dicebear.com/7.x/initials/svg?seed=MamaNgozi&backgroundColor=C84B31', true, 4.9, 42, 8),
  ('Accra Fashion House', 'Kwame Mensah', 'Premium Ghanaian fabrics, kente cloth, and tailored African fashion. Ready-made and custom orders available.', 'KL', ARRAY['Fashion'], '60173346205', 'https://api.dicebear.com/7.x/initials/svg?seed=AccraFashion&backgroundColor=1a1a2e', true, 4.7, 28, 12)
ON CONFLICT DO NOTHING;

INSERT INTO products (title, description, price, category, location, seller_id, seller_name, seller_whatsapp, is_sponsored, is_premium_seller, rating, review_count, stock, delivery_options, payment_methods)
VALUES
  ('Jollof Rice Party Pack (10 pax)', 'Smoky party jollof rice cooked with premium tomatoes and spices. Includes fried chicken and plantain. Perfect for events.', 85.00, 'Food', 'KL', 1, 'Mama Ngozi Kitchen', '60173346205', true, true, 4.9, 18, 20, ARRAY['Grab Delivery','Self Pickup'], ARRAY['Bank Transfer','Cash']),
  ('Suya Skewers (500g)', 'Grilled beef suya with groundnut spice rub. Comes with sliced onions and tomatoes. Ready in 30 minutes.', 25.00, 'Food', 'KL', 1, 'Mama Ngozi Kitchen', '60173346205', false, true, 4.8, 12, 50, ARRAY['Grab Delivery','Self Pickup'], ARRAY['Bank Transfer','Cash']),
  ('Kente Print Midi Dress', 'Beautiful hand-woven kente fabric made into a modern midi dress. Available in sizes S-XL. Ships within 3 days.', 180.00, 'Fashion', 'KL', 2, 'Accra Fashion House', '60173346205', true, true, 4.7, 9, 15, ARRAY['Poslaju','Self Pickup'], ARRAY['Bank Transfer','Touch n Go']),
  ('Ankara Headwrap (Set of 3)', 'Vibrant Ankara fabric headwraps in 3 complementary prints. Pre-tied and easy to wear. One size fits all.', 45.00, 'Fashion', 'KL', 2, 'Accra Fashion House', '60173346205', false, true, 4.6, 7, 30, ARRAY['Poslaju','Grab Delivery'], ARRAY['Bank Transfer','Touch n Go'])
ON CONFLICT DO NOTHING;
