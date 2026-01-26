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

// code/samarqand-school/functions/api/participant/receipt.ts
var generateFilePath = (email, filename) => {
  const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
  const extension = filename.split(".").pop() || "file";
  const fileId = crypto.randomUUID();
  return `payments/${safeEmail}/${fileId}.${extension}`;
};
var onRequest = async ({ request, env }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }
  const user = await getSessionUser(env, request);
  if (!user || user.role !== "participant") {
    return jsonResponse({ success: false, error: "Unauthorized" }, 401);
  }
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return jsonResponse({ success: false, error: "Unsupported content type" }, 415);
  }
  const form = await request.formData();
  const file = form.get("receipt");
  const paymentId = String(form.get("paymentId") || "").trim();
  if (!(file instanceof File) || file.size === 0) {
    return jsonResponse({ success: false, error: "Receipt required" }, 400);
  }
  const registration = await env.DB.prepare("select id from registrations where user_id = ?").bind(user.id).first();
  if (!registration) {
    return jsonResponse({ success: false, error: "Registration not found" }, 404);
  }
  let payment = null;
  if (paymentId) {
    payment = await env.DB.prepare("select id from payments where id = ? and registration_id = ?").bind(paymentId, registration.id).first();
  } else {
    payment = await env.DB.prepare("select id from payments where registration_id = ?").bind(registration.id).first();
  }
  if (!payment) {
    return jsonResponse({ success: false, error: "Payment not found" }, 404);
  }
  const filePath = generateFilePath(user.email, file.name);
  try {
    await env.REGISTRATION_FILES.put(filePath, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" }
    });
  } catch (error) {
    console.error("R2 receipt upload error:", error);
    return jsonResponse({ success: false, error: "Upload failed" }, 500);
  }
  await env.DB.prepare(
    `update payments
     set receipt_path = ?, receipt_name = ?, status = ?, updated_at = ?
     where id = ?`
  ).bind(filePath, file.name, "under_review", (/* @__PURE__ */ new Date()).toISOString(), payment.id).run();
  return jsonResponse({ success: true });
};
export {
  onRequest
};
