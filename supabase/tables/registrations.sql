CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    organization TEXT,
    specialty TEXT,
    membership_years TEXT,
    created_at TIMESTAMP DEFAULT now()
);