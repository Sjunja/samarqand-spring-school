-- Migration: reg
-- Created at: 1768495067

CREATE TABLE registrations (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT, email TEXT, phone TEXT, organization TEXT, specialty TEXT, membership_years TEXT, created_at TIMESTAMPTZ DEFAULT now());;