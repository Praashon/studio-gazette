-- ============================================================
-- Studio Gazette - Supabase Schema with STRICT RLS
-- Run this in your Supabase SQL Editor
-- ============================================================

-- =========================
-- 1. Categories Table
-- =========================
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#ff6b00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Public read access to categories
CREATE POLICY "categories_public_read"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can insert/update/delete categories
-- (no explicit policy = denied for anon/authenticated)

-- =========================
-- 2. Articles Table
-- =========================
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  author TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  read_time_minutes INT DEFAULT 5,
  guid TEXT UNIQUE
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read access to articles
CREATE POLICY "articles_public_read"
  ON articles FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can insert/update/delete articles (RSS ingestion)
-- No INSERT/UPDATE/DELETE policies for anon = strict deny

-- =========================
-- 3. Bookmarks Table
-- =========================
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, session_id)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can read their own bookmarks (matched by session_id passed as header)
CREATE POLICY "bookmarks_read_own"
  ON bookmarks FOR SELECT
  TO anon, authenticated
  USING (session_id = current_setting('request.headers', true)::json->>'x-session-id');

-- Users can insert their own bookmarks
CREATE POLICY "bookmarks_insert_own"
  ON bookmarks FOR INSERT
  TO anon, authenticated
  WITH CHECK (session_id = current_setting('request.headers', true)::json->>'x-session-id');

-- Users can delete their own bookmarks
CREATE POLICY "bookmarks_delete_own"
  ON bookmarks FOR DELETE
  TO anon, authenticated
  USING (session_id = current_setting('request.headers', true)::json->>'x-session-id');

-- =========================
-- 4. RSS Sources Table
-- =========================
CREATE TABLE rss_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  feed_url TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE rss_sources ENABLE ROW LEVEL SECURITY;

-- Public read access to RSS sources (so UI can show source names)
CREATE POLICY "rss_sources_public_read"
  ON rss_sources FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service role can modify RSS sources
-- No INSERT/UPDATE/DELETE policies for anon = strict deny

-- =========================
-- 5. Indexes for Performance
-- =========================
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_featured ON articles(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_articles_breaking ON articles(is_breaking) WHERE is_breaking = TRUE;
CREATE INDEX idx_articles_guid ON articles(guid);
CREATE INDEX idx_bookmarks_session ON bookmarks(session_id);
CREATE INDEX idx_bookmarks_article ON bookmarks(article_id);

-- =========================
-- 6. Seed Categories
-- =========================
INSERT INTO categories (name, slug, color) VALUES
  ('Technology', 'technology', '#ff6b00'),
  ('Business', 'business', '#a04100'),
  ('Science', 'science', '#0062a1'),
  ('Health', 'health', '#059eff'),
  ('World', 'world', '#96481e'),
  ('Sports', 'sports', '#1a1c1c'),
  ('Entertainment', 'entertainment', '#ba1a1a'),
  ('Politics', 'politics', '#5a4136');

-- =========================
-- 7. Seed RSS Sources
-- =========================
INSERT INTO rss_sources (name, feed_url, category_id) VALUES
  ('TechCrunch', 'https://techcrunch.com/feed/', (SELECT id FROM categories WHERE slug = 'technology')),
  ('The Verge', 'https://www.theverge.com/rss/index.xml', (SELECT id FROM categories WHERE slug = 'technology')),
  ('BBC World', 'https://feeds.bbci.co.uk/news/world/rss.xml', (SELECT id FROM categories WHERE slug = 'world')),
  ('BBC Business', 'https://feeds.bbci.co.uk/news/business/rss.xml', (SELECT id FROM categories WHERE slug = 'business')),
  ('BBC Science', 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', (SELECT id FROM categories WHERE slug = 'science')),
  ('ESPN', 'https://www.espn.com/espn/rss/news', (SELECT id FROM categories WHERE slug = 'sports')),
  ('Reuters World', 'https://feeds.reuters.com/reuters/worldNews', (SELECT id FROM categories WHERE slug = 'world'));
