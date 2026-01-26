// functions/api/shared.lib.ts
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
var buildCookie = (name, value, maxAgeSeconds) => {
  const attributes = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${maxAgeSeconds}`,
    "HttpOnly",
    "SameSite=Lax",
    "Secure"
  ];
  return attributes.join("; ");
};

// functions/api/auth.lib.ts
var SESSION_COOKIE = "session_token";
var SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
var encoder = new TextEncoder();
var createSessionCookie = (token) => {
  return buildCookie(SESSION_COOKIE, token, SESSION_TTL_SECONDS);
};
var createSession = async (env, userId, request) => {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1e3).toISOString();
  const ip = request.headers.get("cf-connecting-ip");
  const userAgent = request.headers.get("user-agent");
  await env.DB.prepare(
    "insert into sessions (id, user_id, token, expires_at, ip, user_agent) values (?, ?, ?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), userId, token, expiresAt, ip, userAgent).run();
  return { token, expiresAt };
};

// functions/api/dev/impersonate.ts
var isDeveloper = (request, env) => {
  const email = request.headers.get("Cf-Access-Authenticated-User-Email") || "";
  if (!email || !env.DEVELOPER_EMAILS) return false;
  const allowed = env.DEVELOPER_EMAILS.split(",").map((item) => item.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.toLowerCase());
};
var onRequest = async ({ request, env }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }
  if (!isDeveloper(request, env)) {
    return jsonResponse({ success: false, error: "Unauthorized" }, 401);
  }
  let payload = {};
  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ success: false, error: "Invalid JSON" }, 400);
  }
  const userId = String(payload.userId || "").trim();
  if (!userId) {
    return jsonResponse({ success: false, error: "User ID required" }, 400);
  }
  const user = await env.DB.prepare("select id from users where id = ?").bind(userId).first();
  if (!user) {
    return jsonResponse({ success: false, error: "User not found" }, 404);
  }
  const session = await createSession(env, userId, request);
  const cookie = createSessionCookie(session.token);
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookie,
      ...corsHeaders
    }
  });
};
export {
  onRequest
};
