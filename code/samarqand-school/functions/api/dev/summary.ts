import { getSessionUser } from '../auth.lib';
import { corsHeaders, jsonResponse } from '../shared.lib';

interface Env {
  DB: D1Database;
  DEVELOPER_EMAILS?: string;
}

const isDeveloper = async (request: Request, env: Env) => {
  const sessionUser = await getSessionUser(env, request);
  if (sessionUser?.role === 'developer') {
    return true;
  }
  const email = request.headers.get('Cf-Access-Authenticated-User-Email') || '';
  if (!email || !env.DEVELOPER_EMAILS) return false;
  const allowed = env.DEVELOPER_EMAILS.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.toLowerCase());
};

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  if (!await isDeveloper(request, env)) {
    return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
  }

  const users = await env.DB.prepare(
    'select id, email, role, name, registration_id, created_at from users order by created_at desc'
  ).all();

  const registrations = await env.DB.prepare('select count(*) as count from registrations').first();
  const payments = await env.DB.prepare('select count(*) as count from payments').first();

  return jsonResponse({
    success: true,
    stats: {
      registrations: Number(registrations?.count ?? 0),
      payments: Number(payments?.count ?? 0),
    },
    users: users?.results ?? [],
  });
};
