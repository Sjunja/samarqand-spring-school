-- Migration: db_setup
-- Created at: 1768495601

CREATE TABLE IF NOT EXISTS registrations (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, phone TEXT, organization TEXT, specialty TEXT, membership_years TEXT, created_at TIMESTAMPTZ DEFAULT NOW());;