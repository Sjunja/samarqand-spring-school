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
var parseCookies = (request) => {
  const cookieHeader = request.headers.get("cookie") || "";
  return cookieHeader.split(";").reduce((acc, pair) => {
    const [rawKey, ...rest] = pair.trim().split("=");
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
};

// functions/api/auth.lib.ts
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

// functions/api/admin/submissions.ts
var onRequest = async ({ request, env }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }
  const user = await getSessionUser(env, request);
  if (!user || user.role !== "admin") {
    return jsonResponse({ success: false, error: "Unauthorized" }, 401);
  }
  const result = await env.DB.prepare(
    `select submissions.*, registrations.name as participant_name, registrations.email as participant_email
     from submissions
     left join registrations on registrations.id = submissions.registration_id
     order by submissions.created_at desc`
  ).all();
  return jsonResponse({ success: true, submissions: result?.results ?? [] });
};
export {
  onRequest
};
