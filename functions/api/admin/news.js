// code/samarqand-school/functions/api/shared.lib.ts
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

// code/samarqand-school/functions/api/admin/news.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Cookie",
  "Access-Control-Allow-Credentials": "true"
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
var onRequest = async ({ request, env }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  const user = await getSessionUser(env, request);
  if (!user || user.role !== "admin") {
    return jsonResponse({ error: "Unauthorized" }, 403);
  }
  try {
    if (request.method === "GET") {
      const result = await env.DB.prepare("SELECT * FROM news ORDER BY published_at DESC").all();
      return jsonResponse({ news: result?.results ?? [] });
    }
    if (request.method === "POST") {
      const body = await request.json();
      const id = crypto.randomUUID();
      const is_published = body.is_published ? 1 : 0;
      await env.DB.prepare(`
          INSERT INTO news (id, title_en, title_ru, title_uz, content_en, content_ru, content_uz, is_published, published_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(
        id,
        body.title_en,
        body.title_ru,
        body.title_uz,
        body.content_en,
        body.content_ru,
        body.content_uz,
        is_published
      ).run();
      return jsonResponse({ success: true, id });
    }
    if (request.method === "PUT") {
      const body = await request.json();
      if (!body.id) {
        return jsonResponse({ error: "Missing news ID" }, 400);
      }
      const updates = [];
      const values = [];
      if (body.title_en !== void 0) {
        updates.push("title_en = ?");
        values.push(body.title_en);
      }
      if (body.title_ru !== void 0) {
        updates.push("title_ru = ?");
        values.push(body.title_ru);
      }
      if (body.title_uz !== void 0) {
        updates.push("title_uz = ?");
        values.push(body.title_uz);
      }
      if (body.content_en !== void 0) {
        updates.push("content_en = ?");
        values.push(body.content_en);
      }
      if (body.content_ru !== void 0) {
        updates.push("content_ru = ?");
        values.push(body.content_ru);
      }
      if (body.content_uz !== void 0) {
        updates.push("content_uz = ?");
        values.push(body.content_uz);
      }
      if (body.is_published !== void 0) {
        updates.push("is_published = ?");
        values.push(body.is_published ? 1 : 0);
      }
      if (updates.length === 0) {
        return jsonResponse({ error: "No fields to update" }, 400);
      }
      values.push(body.id);
      await env.DB.prepare(`UPDATE news SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();
      return jsonResponse({ success: true });
    }
    if (request.method === "DELETE") {
      const url = new URL(request.url);
      const id = url.searchParams.get("id");
      if (!id) {
        return jsonResponse({ error: "Missing news ID" }, 400);
      }
      await env.DB.prepare("DELETE FROM news WHERE id = ?").bind(id).run();
      return jsonResponse({ success: true });
    }
    return jsonResponse({ error: "Method not allowed" }, 405);
  } catch (error) {
    console.error("Admin news error:", error);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
};
export {
  onRequest
};
