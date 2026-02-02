interface Env {
  DB: D1Database;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const jsonResponse = (payload: Record<string, unknown>, status = 200) => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
};

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  try {
    // Count only registrations with confirmed payments (approved participants)
    const result = await env.DB.prepare(`
      select count(distinct r.id) as count
      from registrations r
      inner join payments p on r.id = p.registration_id
      where p.status = 'confirmed'
    `).first();
    const count = typeof result?.count === 'number' ? result.count : Number(result?.count ?? 0);
    return jsonResponse({ count });
  } catch (error) {
    console.error('D1 count error:', error);
    return jsonResponse({ count: 0 }, 500);
  }
};
