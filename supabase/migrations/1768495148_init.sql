-- Migration: init
-- Created at: 1768495148


CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  organization TEXT,
  specialty TEXT,
  membership_years TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_uz TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_ru TEXT NOT NULL,
  content_uz TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT FALSE
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "public_select" ON registrations FOR SELECT USING (true);
CREATE POLICY "public_news_select" ON news FOR SELECT USING (is_published = true);
;