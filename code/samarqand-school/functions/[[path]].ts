export const onRequest: PagesFunction = async ({ request, env }) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname.startsWith('/api/')) {
    return new Response('Not Found', { status: 404 });
  }

  if (pathname.startsWith('/assets/') || pathname.startsWith('/images/') || pathname.includes('.')) {
    return env.ASSETS.fetch(request);
  }

  const indexUrl = new URL('/', url);
  return env.ASSETS.fetch(new Request(indexUrl, request));
};
