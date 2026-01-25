Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    // Create registrations table
    const createRegTable = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS registrations (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            organization TEXT,
            specialty TEXT,
            membership_years TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          
          CREATE TABLE IF NOT EXISTS news (
            id SERIAL PRIMARY KEY,
            title_en TEXT NOT NULL,
            title_ru TEXT NOT NULL,
            title_uz TEXT NOT NULL,
            content_en TEXT NOT NULL,
            content_ru TEXT NOT NULL,
            content_uz TEXT NOT NULL,
            published_at TIMESTAMPTZ DEFAULT NOW(),
            is_published BOOLEAN DEFAULT FALSE
          );
          
          ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
          ALTER TABLE news ENABLE ROW LEVEL SECURITY;
          
          DROP POLICY IF EXISTS "allow_insert" ON registrations;
          DROP POLICY IF EXISTS "allow_select" ON registrations;
          DROP POLICY IF EXISTS "allow_news_select" ON news;
          
          CREATE POLICY "allow_insert" ON registrations FOR INSERT WITH CHECK (true);
          CREATE POLICY "allow_select" ON registrations FOR SELECT USING (true);
          CREATE POLICY "allow_news_select" ON news FOR SELECT USING (is_published = true);
        `
      }),
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Database initialized'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
