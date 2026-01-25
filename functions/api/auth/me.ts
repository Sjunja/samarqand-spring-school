import { getSessionUser } from '../_auth';
import { corsHeaders, jsonResponse } from '../_shared';

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
  if (!user) {
    return jsonResponse({ success: false }, 401);
  }

  return jsonResponse({ success: true, user });
};
