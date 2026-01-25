CREATE TABLE news (
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