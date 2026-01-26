import { getSessionUser } from '../../auth.lib';
import { corsHeaders, jsonResponse } from '../../shared.lib';

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
  if (!user || user.role !== 'admin') {
    return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
  }

  const result = await env.DB.prepare(
    `select submissions.*, registrations.name as participant_name, registrations.email as participant_email
     from submissions
     left join registrations on registrations.id = submissions.registration_id
     order by submissions.created_at desc`
  ).all();

  return jsonResponse({ success: true, submissions: result?.results ?? [] });
};
