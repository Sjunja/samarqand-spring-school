import { getSessionUser } from '../../auth.lib';
import { corsHeaders, jsonResponse } from '../../shared.lib';

interface Env {
  DB: D1Database;
  REGISTRATION_FILES: R2Bucket;
}

const generateFilePath = (email: string, filename: string) => {
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
  const extension = filename.split('.').pop() || 'file';
  const fileId = crypto.randomUUID();
  return `payments/${safeEmail}/${fileId}.${extension}`;
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
  const file = form.get('receipt');
  const paymentId = String(form.get('paymentId') || '').trim();

  if (!(file instanceof File) || file.size === 0) {
    return jsonResponse({ success: false, error: 'Receipt required' }, 400);
  }

  const registration = await env.DB.prepare('select id from registrations where user_id = ?')
    .bind(user.id)
    .first<{ id: string }>();

  if (!registration) {
    return jsonResponse({ success: false, error: 'Registration not found' }, 404);
  }

  let payment: { id: string } | null = null;
  if (paymentId) {
    payment = await env.DB.prepare('select id from payments where id = ? and registration_id = ?')
      .bind(paymentId, registration.id)
      .first<{ id: string }>();
  } else {
    payment = await env.DB.prepare('select id from payments where registration_id = ?')
      .bind(registration.id)
      .first<{ id: string }>();
  }

  if (!payment) {
    return jsonResponse({ success: false, error: 'Payment not found' }, 404);
  }

  const filePath = generateFilePath(user.email, file.name);

  try {
    await env.REGISTRATION_FILES.put(filePath, file.stream(), {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
    });
  } catch (error) {
    console.error('R2 receipt upload error:', error);
    return jsonResponse({ success: false, error: 'Upload failed' }, 500);
  }

  await env.DB.prepare(
    `update payments
     set receipt_path = ?, receipt_name = ?, status = ?, updated_at = ?
     where id = ?`
  )
    .bind(filePath, file.name, 'under_review', new Date().toISOString(), payment.id)
    .run();

  return jsonResponse({ success: true });
};
