-- Migration: create_reg_table
-- Created at: 1768495087

CREATE TABLE registrations (id serial primary key, name text, email text, phone text, org text, spec text, years text);;