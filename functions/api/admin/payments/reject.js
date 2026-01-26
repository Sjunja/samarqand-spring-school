// code/samarqand-school/functions/api/shared.lib.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var jsonResponse = (payload, status = 200) => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders
    }
  });
};
var parseCookies = (request) => {
  const cookieHeader = request.headers.get("cookie") || "";
  return cookieHeader.split(";").reduce((acc, pair) => {
    const [rawKey, ...rest] = pair.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
};

// code/samarqand-school/functions/api/auth.lib.ts
var SESSION_COOKIE = "session_token";
var SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
var encoder = new TextEncoder();
var getSessionUser = async (env, request) => {
  const cookies = parseCookies(request);
  const token = cookies[SESSION_COOKIE];
  if (!token) {
    return null;
  }
  const record = await env.DB.prepare(
    `select sessions.token, sessions.expires_at, users.id as user_id, users.email, users.role, users.name, users.registration_id
     from sessions
     join users on users.id = sessions.user_id
     where sessions.token = ?`
  ).bind(token).first();
  if (!record) {
    return null;
  }
  const expiresAt = new Date(record.expires_at);
  if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
    await env.DB.prepare("delete from sessions where token = ?").bind(token).run();
    return null;
  }
  return {
    id: record.user_id,
    email: record.email,
    role: record.role,
    name: record.name,
    registrationId: record.registration_id
  };
};

// code/samarqand-school/functions/api/email.lib.ts
var MAIL_ENDPOINT = "https://api.mailchannels.net/tx/v1/send";
var sendEmail = async (env, params) => {
  if (!env.MAIL_FROM) {
    console.warn("MAIL_FROM is not configured, skipping email send.");
    return { ok: false, error: "MAIL_FROM not configured" };
  }
  const payload = {
    personalizations: [
      {
        to: [{ email: params.to }],
        ...params.cc ? { cc: [{ email: params.cc }] } : {}
      }
    ],
    from: {
      email: env.MAIL_FROM,
      name: env.MAIL_FROM_NAME || "Samarqand School"
    },
    subject: params.subject,
    content: [
      { type: "text/plain", value: params.text },
      { type: "text/html", value: params.html }
    ]
  };
  if (env.MAIL_REPLY_TO) {
    payload.reply_to = { email: env.MAIL_REPLY_TO };
  }
  const response = await fetch(MAIL_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("MailChannels error:", response.status, errorText);
    return { ok: false, error: errorText };
  }
  return { ok: true };
};

// code/samarqand-school/functions/api/admin/payments/reject.ts
var onRequest = async ({ request, env }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }
  const user = await getSessionUser(env, request);
  if (!user || user.role !== "admin") {
    return jsonResponse({ success: false, error: "Unauthorized" }, 401);
  }
  let payload = {};
  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ success: false, error: "Invalid JSON" }, 400);
  }
  const paymentId = String(payload.paymentId || "").trim();
  const reason = String(payload.reason || "").trim();
  if (!paymentId) {
    return jsonResponse({ success: false, error: "Payment ID required" }, 400);
  }
  await env.DB.prepare(
    `update payments
     set status = ?, rejection_reason = ?, updated_at = ?, confirmed_by = ?
     where id = ?`
  ).bind("rejected", reason || null, (/* @__PURE__ */ new Date()).toISOString(), user.id, paymentId).run();
  const registration = await env.DB.prepare(
    `select registrations.name, registrations.email
     from payments
     join registrations on registrations.id = payments.registration_id
     where payments.id = ?`
  ).bind(paymentId).first();
  if (registration) {
    const subject = "\u041E\u043F\u043B\u0430\u0442\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0430: \u0421\u0430\u043C\u0430\u0440\u043A\u0430\u043D\u0434\u0441\u043A\u0430\u044F \u0448\u043A\u043E\u043B\u0430 2026";
    const text = [
      `\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, ${registration.name}!`,
      "",
      "\u041A \u0441\u043E\u0436\u0430\u043B\u0435\u043D\u0438\u044E, \u043E\u043F\u043B\u0430\u0442\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0430.",
      reason ? `\u041F\u0440\u0438\u0447\u0438\u043D\u0430: ${reason}` : null,
      "\u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u043F\u043B\u0430\u0442\u0435\u0436\u043D\u044B\u0439 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \u0432 \u043B\u0438\u0447\u043D\u043E\u043C \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435."
    ].filter(Boolean).join("\n");
    const html = `
      <p>\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435, ${registration.name}!</p>
      <p>\u041A \u0441\u043E\u0436\u0430\u043B\u0435\u043D\u0438\u044E, \u043E\u043F\u043B\u0430\u0442\u0430 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0430.</p>
      ${reason ? `<p><strong>\u041F\u0440\u0438\u0447\u0438\u043D\u0430:</strong> ${reason}</p>` : ""}
      <p>\u0412\u044B \u043C\u043E\u0436\u0435\u0442\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u043F\u043B\u0430\u0442\u0435\u0436\u043D\u044B\u0439 \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442 \u0432 \u043B\u0438\u0447\u043D\u043E\u043C \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435.</p>
    `;
    await sendEmail(env, {
      to: registration.email,
      subject,
      text,
      html,
      cc: env.SCHOOL_EMAIL
    });
  }
  return jsonResponse({ success: true });
};
export {
  onRequest
};
