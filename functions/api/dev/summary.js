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

// code/samarqand-school/functions/api/dev/summary.ts
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
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }
  if (!isDeveloper(request, env)) {
    return jsonResponse({ success: false, error: "Unauthorized" }, 401);
  }
  const users = await env.DB.prepare(
    "select id, email, role, name, registration_id, created_at from users order by created_at desc"
  ).all();
  const registrations = await env.DB.prepare("select count(*) as count from registrations").first();
  const payments = await env.DB.prepare("select count(*) as count from payments").first();
  return jsonResponse({
    success: true,
    stats: {
      registrations: Number(registrations?.count ?? 0),
      payments: Number(payments?.count ?? 0)
    },
    users: users?.results ?? []
  });
};
export {
  onRequest
};
