export const onRequest: PagesFunction = async ({ request, env, next }) => {
  const url = new URL(request.url);

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return next();
  }

  const pathname = url.pathname;
  if (pathname.startsWith('/api/')) {
    return next();
  }

  if (pathname.startsWith('/assets/') || pathname.startsWith('/images/')) {
    return next();
  }

  if (pathname.includes('.')) {
    return next();
  }

  const indexUrl = new URL('/', url);
  return env.ASSETS.fetch(new Request(indexUrl, request));
};
