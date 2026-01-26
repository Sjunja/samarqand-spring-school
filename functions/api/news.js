// functions/api/news.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var onRequest = async ({ request, env }) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }
  try {
    const result = await env.DB.prepare("select * from news where is_published = 1 order by published_at desc").all();
    return new Response(JSON.stringify(result?.results ?? []), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("D1 news error:", error);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};
export {
  onRequest
};
