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

// code/samarqand-school/functions/api/auth.lib.ts
var SESSION_COOKIE = "session_token";
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
var fromBase64 = (value) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};
var isHexString = (value) => /^[0-9a-f]+$/i.test(value) && value.length % 2 === 0;
var isLegacyHash = (salt, hash) => isHexString(salt) && isHexString(hash) && salt.length === 32 && hash.length === 128;
var toHex = (buffer) => {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};
var verifyPassword = async (password, saltBase64, hashBase64) => {
  try {
    const saltBuffer2 = fromBase64(saltBase64);
    const key2 = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
    const hash2 = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBuffer2,
        iterations: PASSWORD_ITERATIONS,
        hash: "SHA-256"
      },
      key2,
      PASSWORD_KEY_LENGTH * 8
    );
    if (toBase64(hash2) === hashBase64) {
      return true;
    }
  } catch {
  }
  if (!isLegacyHash(saltBase64, hashBase64)) {
    return false;
  }
  const saltBuffer = encoder.encode(saltBase64);
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 1e3,
      hash: "SHA-512"
    },
    key,
    64 * 8
  );
  return toHex(hash) === hashBase64.toLowerCase();
};
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

// code/samarqand-school/functions/api/auth/login.ts
var onRequest = async ({ request, env }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }
  let payload = {};
  try {
    payload = await request.json();
  } catch (error) {
    return jsonResponse({ success: false, error: "Invalid JSON" }, 400);
  }
  const email = String(payload.email || "").trim().toLowerCase();
  const password = String(payload.password || "");
  const role = payload.role ? String(payload.role) : null;
  if (!email || !password) {
    return jsonResponse({ success: false, error: "Missing credentials" }, 400);
  }
  const user = await env.DB.prepare(
    "select id, email, password_hash, password_salt, role, name, registration_id from users where email = ?"
  ).bind(email).first();
  if (!user) {
    return jsonResponse({ success: false, error: "Invalid credentials" }, 401);
  }
  if (role && user.role !== role) {
    return jsonResponse({ success: false, error: "Access denied" }, 403);
  }
  const isValid = await verifyPassword(password, user.password_salt, user.password_hash);
  if (!isValid) {
    return jsonResponse({ success: false, error: "Invalid credentials" }, 401);
  }
  const session = await createSession(env, user.id, request);
  const cookie = createSessionCookie(session.token);
  return new Response(
    JSON.stringify({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        registrationId: user.registration_id
      }
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
        ...corsHeaders
      }
    }
  );
};
export {
  onRequest
};
