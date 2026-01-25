-- Migration: create_tables
-- Created at: 1768493924


CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  organization VARCHAR(255),
  specialty VARCHAR(100),
  membership_years VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  title_uz TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_ru TEXT NOT NULL,
  content_uz TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert_registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_select_registrations" ON registrations FOR SELECT USING (true);
CREATE POLICY "allow_select_published_news" ON news FOR SELECT USING (is_published = true);
;