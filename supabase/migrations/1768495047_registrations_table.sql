-- Migration: registrations_table
-- Created at: 1768495047

CREATE TABLE registrations (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, phone TEXT, organization TEXT, specialty TEXT, membership_years TEXT, created_at TIMESTAMPTZ DEFAULT NOW());;