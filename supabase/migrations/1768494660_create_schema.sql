-- Migration: create_schema
-- Created at: 1768494660

CREATE TABLE registrations (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, phone VARCHAR(50), organization VARCHAR(255), specialty VARCHAR(100), membership_years VARCHAR(100), created_at TIMESTAMPTZ DEFAULT NOW());;