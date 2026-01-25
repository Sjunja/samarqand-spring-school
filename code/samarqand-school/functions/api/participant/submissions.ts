import { getSessionUser } from '../../_auth';
import { corsHeaders, jsonResponse } from '../../_shared';

interface Env {
  DB: D1Database;
  REGISTRATION_FILES: R2Bucket;
}

const generateFilePath = (email: string, filename: string) => {
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  const extension = filename.split('.').pop() || 'file';
  const fileId = crypto.randomUUID();
  return `submissions/${safeEmail}/${fileId}.${extension}`;
};

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  const user = await getSessionUser(env, request);
  if (!user || user.role !== 'participant') {
    return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data')) {
    return jsonResponse({ success: false, error: 'Unsupported content type' }, 415);
  }

  const form = await request.formData();
  const file = form.get('file');
  const type = String(form.get('type') || '').trim();
  const title = String(form.get('title') || '').trim();

  const allowedTypes = ['abstract', 'article', 'poster'];
  if (!type || !allowedTypes.includes(type)) {
    return jsonResponse({ success: false, error: 'Type required' }, 400);
  }
  if (!(file instanceof File) || file.size === 0) {
    return jsonResponse({ success: false, error: 'File required' }, 400);
  }

  const registration = await env.DB.prepare('select id from registrations where user_id = ?')
    .bind(user.id)
    .first<{ id: string }>();

  if (!registration) {
    return jsonResponse({ success: false, error: 'Registration not found' }, 404);
  }

  const filePath = generateFilePath(user.email, file.name);

  try {
    await env.REGISTRATION_FILES.put(filePath, file.stream(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
    });
  } catch (error) {
    console.error('R2 submission upload error:', error);
    return jsonResponse({ success: false, error: 'Upload failed' }, 500);
  }

  await env.DB.prepare(
    `insert into submissions (id, registration_id, user_id, type, title, file_path, file_name)
     values (?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(crypto.randomUUID(), registration.id, user.id, type, title || null, filePath, file.name)
    .run();

  return jsonResponse({ success: true });
};
