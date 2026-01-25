import { getSessionUser } from '../../_auth';
import { corsHeaders, jsonResponse } from '../../_shared';

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
    `select
      registrations.*,
      payments.id as payment_id,
      payments.status as payment_status,
      payments.amount as payment_amount,
      payments.currency as payment_currency,
      payments.receipt_path as payment_receipt_path,
      payments.receipt_name as payment_receipt_name,
      payments.invoice_number as payment_invoice_number,
      payments.updated_at as payment_updated_at
     from registrations
     left join payments on payments.registration_id = registrations.id
     order by registrations.created_at desc`
  ).all();

  return jsonResponse({ success: true, registrations: result?.results ?? [] });
};
