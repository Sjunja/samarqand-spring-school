import { getSessionUser } from '../auth.lib';
import { corsHeaders, jsonResponse } from '../shared.lib';

interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  const user = await getSessionUser(env, request);
  if (!user || user.role !== 'participant') {
    return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
  }

  const registration = await env.DB.prepare(
    'select * from registrations where user_id = ?'
  )
    .bind(user.id)
    .first();

  const payment = registration
    ? await env.DB.prepare('select * from payments where registration_id = ?')
      .bind(registration.id)
      .first()
    : null;

  const submissions = registration
    ? await env.DB.prepare('select * from submissions where registration_id = ? order by created_at desc')
      .bind(registration.id)
      .all()
    : { results: [] };

  return jsonResponse({
    success: true,
    user,
    registration,
    payment,
    submissions: submissions?.results ?? [],
  });
};
