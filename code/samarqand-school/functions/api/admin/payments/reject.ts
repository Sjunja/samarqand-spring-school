import { getSessionUser } from '../../../auth.lib';
import { sendEmail } from '../../../email.lib';
import { corsHeaders, jsonResponse } from '../../../shared.lib';

interface Env {
  DB: D1Database;
  MAIL_FROM: string;
  MAIL_FROM_NAME?: string;
  MAIL_REPLY_TO?: string;
  SCHOOL_EMAIL?: string;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
  }

  const user = await getSessionUser(env, request);
  if (!user || user.role !== 'admin') {
    return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
  }

  let payload: { paymentId?: string; reason?: string } = {};
  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ success: false, error: 'Invalid JSON' }, 400);
  }

  const paymentId = String(payload.paymentId || '').trim();
  const reason = String(payload.reason || '').trim();
  if (!paymentId) {
    return jsonResponse({ success: false, error: 'Payment ID required' }, 400);
  }

  await env.DB.prepare(
    `update payments
     set status = ?, rejection_reason = ?, updated_at = ?, confirmed_by = ?
     where id = ?`
  )
    .bind('rejected', reason || null, new Date().toISOString(), user.id, paymentId)
    .run();

  const registration = await env.DB.prepare(
    `select registrations.name, registrations.email
     from payments
     join registrations on registrations.id = payments.registration_id
     where payments.id = ?`
  )
    .bind(paymentId)
    .first<{ name: string; email: string }>();

  if (registration) {
    const subject = 'Оплата отклонена: Самаркандская школа 2026';
    const text = [
      `Здравствуйте, ${registration.name}!`,
      '',
      'К сожалению, оплата отклонена.',
      reason ? `Причина: ${reason}` : null,
      'Вы можете загрузить корректный платежный документ в личном кабинете.',
    ].filter(Boolean).join('\n');
    const html = `
      <p>Здравствуйте, ${registration.name}!</p>
      <p>К сожалению, оплата отклонена.</p>
      ${reason ? `<p><strong>Причина:</strong> ${reason}</p>` : ''}
      <p>Вы можете загрузить корректный платежный документ в личном кабинете.</p>
    `;
    await sendEmail(env, {
      to: registration.email,
      subject,
      text,
      html,
      cc: env.SCHOOL_EMAIL,
    });
  }

  return jsonResponse({ success: true });
};
