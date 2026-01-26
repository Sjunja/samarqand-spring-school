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

  let payload: { paymentId?: string } = {};
  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ success: false, error: 'Invalid JSON' }, 400);
  }

  const paymentId = String(payload.paymentId || '').trim();
  if (!paymentId) {
    return jsonResponse({ success: false, error: 'Payment ID required' }, 400);
  }

  await env.DB.prepare(
    `update payments
     set status = ?, updated_at = ?, confirmed_by = ?
     where id = ?`
  )
    .bind('confirmed', new Date().toISOString(), user.id, paymentId)
    .run();

  const registration = await env.DB.prepare(
    `select registrations.name, registrations.email, payments.amount, payments.currency
     from payments
     join registrations on registrations.id = payments.registration_id
     where payments.id = ?`
  )
    .bind(paymentId)
    .first<{
      name: string;
      email: string;
      amount: number;
      currency: string;
    }>();

  if (registration) {
    const subject = 'Оплата подтверждена: Самаркандская школа 2026';
    const text = [
      `Здравствуйте, ${registration.name}!`,
      '',
      `Оплата подтверждена. Сумма: ${registration.amount} ${registration.currency}.`,
      'Ждем вас на мероприятии!',
    ].join('\n');
    const html = `
      <p>Здравствуйте, ${registration.name}!</p>
      <p>Оплата подтверждена.</p>
      <p><strong>Сумма:</strong> ${registration.amount} ${registration.currency}</p>
      <p>Ждем вас на мероприятии!</p>
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
