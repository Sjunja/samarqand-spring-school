import { getSessionUser } from './_auth';
import { corsHeaders, jsonResponse } from './_shared';

interface Env {
  REGISTRATION_FILES: R2Bucket;
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
    return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
  }

  const url = new URL(request.url);
  const path = url.searchParams.get('path');
  if (!path) {
    return jsonResponse({ success: false, error: 'Path required' }, 400);
  }

  if (user.role !== 'admin' && user.role !== 'developer') {
    const safeEmail = user.email.replace(/[^a-zA-Z0-9]/g, '_');
    const normalized = path.replace(/^\/+/, '');
    const allowedPrefixes = [
      `membership/${safeEmail}/`,
      `payments/${safeEmail}/`,
      `submissions/${safeEmail}/`,
    ];
    const isAllowed = allowedPrefixes.some((prefix) => normalized.startsWith(prefix));
    if (!isAllowed) {
      return jsonResponse({ success: false, error: 'Forbidden' }, 403);
    }
  }

  const object = await env.REGISTRATION_FILES.get(path);
  if (!object) {
    return jsonResponse({ success: false, error: 'File not found' }, 404);
  }

  const filename = path.split('/').pop() || 'file';
  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
  headers.set('Content-Disposition', `attachment; filename="${filename}"`);
  headers.set('Cache-Control', 'private, max-age=3600');

  return new Response(object.body, { status: 200, headers });
};
