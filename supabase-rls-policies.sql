-- ============================================================
-- MOBAR BİLİŞİM — SUPABASE ROW LEVEL SECURITY POLİTİKALARI
-- Supabase Dashboard > SQL Editor'da bu scripti çalıştır.
-- ============================================================

-- Admin email ayarı (kendi emailin)
ALTER DATABASE postgres SET app.admin_email = 'mobarbilisim@gmail.com';

-- ============================================================
-- 1) PRODUCTS TABLOSU
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_public_read" ON products;
DROP POLICY IF EXISTS "products_admin_insert" ON products;
DROP POLICY IF EXISTS "products_admin_update" ON products;
DROP POLICY IF EXISTS "products_admin_delete" ON products;

CREATE POLICY "products_public_read"
  ON products FOR SELECT USING (true);

CREATE POLICY "products_admin_insert"
  ON products FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

CREATE POLICY "products_admin_update"
  ON products FOR UPDATE
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

CREATE POLICY "products_admin_delete"
  ON products FOR DELETE
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ============================================================
-- 2) ORDERS TABLOSU
-- ============================================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_public_insert" ON orders;
DROP POLICY IF EXISTS "orders_user_select_own" ON orders;
DROP POLICY IF EXISTS "orders_admin_update" ON orders;
DROP POLICY IF EXISTS "orders_admin_delete" ON orders;

CREATE POLICY "orders_public_insert"
  ON orders FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_user_select_own"
  ON orders FOR SELECT
  USING (
    auth.jwt() ->> 'email' = customer_email
    OR auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

CREATE POLICY "orders_admin_update"
  ON orders FOR UPDATE
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

CREATE POLICY "orders_admin_delete"
  ON orders FOR DELETE
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ============================================================
-- 3) USERS (profil) TABLOSU
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select_own_or_admin" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "users_admin_delete" ON users;

CREATE POLICY "users_select_own_or_admin"
  ON users FOR SELECT
  USING (
    auth.uid() = id
    OR auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

CREATE POLICY "users_insert_own"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "users_admin_delete"
  ON users FOR DELETE
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ============================================================
-- 4) CATEGORIES TABLOSU
-- ============================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_public_read" ON categories;
DROP POLICY IF EXISTS "categories_admin_write" ON categories;

CREATE POLICY "categories_public_read"
  ON categories FOR SELECT USING (true);

CREATE POLICY "categories_admin_write"
  ON categories FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ============================================================
-- 5) BLOGS TABLOSU
-- ============================================================
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "blogs_public_read_published" ON blogs;
DROP POLICY IF EXISTS "blogs_admin_write" ON blogs;

CREATE POLICY "blogs_public_read_published"
  ON blogs FOR SELECT
  USING (
    is_published = true
    OR auth.jwt() ->> 'email' = current_setting('app.admin_email', true)
  );

CREATE POLICY "blogs_admin_write"
  ON blogs FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));


-- ============================================================
-- 6) SITE_SETTINGS TABLOSU
-- ============================================================
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_public_read" ON site_settings;
DROP POLICY IF EXISTS "site_settings_admin_write" ON site_settings;

CREATE POLICY "site_settings_public_read"
  ON site_settings FOR SELECT USING (true);

CREATE POLICY "site_settings_admin_write"
  ON site_settings FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
