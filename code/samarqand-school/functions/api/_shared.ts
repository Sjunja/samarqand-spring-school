export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const jsonResponse = (payload: unknown, status = 200) => {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
};

export const parseCookies = (request: Request) => {
  const cookieHeader = request.headers.get('cookie') || '';
  return cookieHeader.split(';').reduce<Record<string, string>>((acc, pair) => {
    const [rawKey, ...rest] = pair.trim().split('=');
    if (!rawKey) return acc;
    acc[rawKey] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
};

export const buildCookie = (name: string, value: string, maxAgeSeconds: number) => {
  const attributes = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${maxAgeSeconds}`,
    'HttpOnly',
    'SameSite=Lax',
    'Secure',
  ];
  return attributes.join('; ');
};

export const buildExpiredCookie = (name: string) => {
  return `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure`;
};
