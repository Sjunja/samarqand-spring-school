-- Migration: setup
-- Created at: 1768495252

CREATE TABLE registrations (id SERIAL PRIMARY KEY, name TEXT, email TEXT UNIQUE, phone TEXT, organization TEXT, specialty TEXT, membership_years TEXT, created_at TIMESTAMP DEFAULT NOW()); CREATE TABLE news (id SERIAL PRIMARY KEY, title_en TEXT, title_ru TEXT, title_uz TEXT, content_en TEXT, content_ru TEXT, content_uz TEXT, published_at TIMESTAMP DEFAULT NOW(), is_published BOOLEAN DEFAULT FALSE);;