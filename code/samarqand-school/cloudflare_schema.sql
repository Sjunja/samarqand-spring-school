-- Cloudflare D1 schema for Samarqand Spring School
-- Run this in the D1 console (or via wrangler) to create tables.

create table if not exists users (
  id text primary key,
  email text not null unique,
  password_hash text not null,
  password_salt text not null,
  role text not null default 'participant',
  name text,
  registration_id text,
  created_at text default (datetime('now'))
);

create table if not exists sessions (
  id text primary key,
  user_id text not null,
  token text not null unique,
  expires_at text not null,
  ip text,
  user_agent text,
  created_at text default (datetime('now'))
);

create table if not exists registrations (
  id text primary key,
  user_id text,
  name text not null,
  birthdate text,
  email text not null unique,
  phone text,
  telegram text,
  city text,
  country text,
  organization text,
  position text,
  specialty text,
  specialty_other text,
  experience integer,
  participation_type text,
  participation_package text,
  participant_category text,
  membership_proof_path text,
  membership_proof_name text,
  consent_data integer not null default 0,
  consent_rules integer not null default 0,
  consent_media integer not null default 0,
  created_at text default (datetime('now'))
);

create table if not exists payments (
  id text primary key,
  registration_id text not null,
  status text not null default 'pending',
  amount integer,
  currency text,
  receipt_path text,
  receipt_name text,
  invoice_number text,
  invoice_path text,
  rejection_reason text,
  confirmed_by text,
  updated_at text default (datetime('now')),
  created_at text default (datetime('now'))
);

create table if not exists submissions (
  id text primary key,
  registration_id text,
  user_id text,
  type text not null,
  title text,
  file_path text,
  file_name text,
  status text not null default 'submitted',
  created_at text default (datetime('now'))
);

create table if not exists news (
  id text primary key,
  title_en text not null,
  title_ru text not null,
  title_uz text not null,
  content_en text not null,
  content_ru text not null,
  content_uz text not null,
  published_at text default (datetime('now')),
  is_published integer default 0
);
