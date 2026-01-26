// functions/api/registration-count.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
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
var onRequest = async ({ request, env }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }
  try {
    const result = await env.DB.prepare("select count(*) as count from registrations").first();
    const count = typeof result?.count === "number" ? result.count : Number(result?.count ?? 0);
    return jsonResponse({ count });
  } catch (error) {
    console.error("D1 count error:", error);
    return jsonResponse({ count: 0 }, 500);
  }
};
export {
  onRequest
};
