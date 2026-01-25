-- Migration: create_tables_final
-- Created at: 1768495214

CREATE TABLE IF NOT EXISTS registrations (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, phone TEXT, organization TEXT, specialty TEXT, membership_years TEXT, created_at TIMESTAMPTZ DEFAULT NOW()); CREATE TABLE IF NOT EXISTS news (id SERIAL PRIMARY KEY, title_en TEXT NOT NULL, title_ru TEXT NOT NULL, title_uz TEXT NOT NULL, content_en TEXT NOT NULL, content_ru TEXT NOT NULL, content_uz TEXT NOT NULL, published_at TIMESTAMPTZ DEFAULT NOW(), is_published BOOLEAN DEFAULT FALSE);;