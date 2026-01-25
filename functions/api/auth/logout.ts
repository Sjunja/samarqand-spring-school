import { clearSessionCookie } from '../_auth';
import { corsHeaders, parseCookies } from '../_shared';

interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  const cookies = parseCookies(request);
  const token = cookies.session_token;
  if (token) {
    await env.DB.prepare('delete from sessions where token = ?').bind(token).run();
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': clearSessionCookie(),
      ...corsHeaders,
    },
  });
};
