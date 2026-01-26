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

// code/samarqand-school/functions/api/auth.lib.ts
var SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
var PASSWORD_ITERATIONS = 12e4;
var PASSWORD_KEY_LENGTH = 32;
var encoder = new TextEncoder();
var toBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
};
var hashPassword = async (password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256"
    },
    key,
    PASSWORD_KEY_LENGTH * 8
  );
  return {
    salt: toBase64(salt.buffer),
    hash: toBase64(hash)
  };
};

// code/samarqand-school/functions/api/dev/create-user.ts
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
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const role = String(payload.role || "admin");
  const name = String(payload.name || "").trim();
  if (!email || !password) {
    return jsonResponse({ success: false, error: "Email and password required" }, 400);
  }
  const { hash, salt } = await hashPassword(password);
  try {
    await env.DB.prepare(
      "insert into users (id, email, password_hash, password_salt, role, name) values (?, ?, ?, ?, ?, ?)"
    ).bind(crypto.randomUUID(), email, hash, salt, role, name || null).run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("unique")) {
      return jsonResponse({ success: false, error: "Email already exists" }, 409);
    }
    console.error("Create user error:", error);
    return jsonResponse({ success: false, error: "Database error" }, 500);
  }
  return jsonResponse({ success: true });
};
export {
  onRequest
};
