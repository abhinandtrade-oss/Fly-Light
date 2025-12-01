export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Default to index.html for root path
    if (pathname === '/') {
      pathname = '/index.html';
    }

    try {
      // Try to get the file from the static assets
      const response = await env.ASSETS.fetch(request.clone());
      return response;
    } catch (error) {
      // If file not found, try serving index.html for SPA routing
      try {
        const indexResponse = await env.ASSETS.fetch(new Request(new URL('/index.html', url).toString(), request));
        return new Response(indexResponse.body, {
          status: 200,
          headers: indexResponse.headers,
        });
      } catch (fallbackError) {
        // Return 404 if index.html also doesn't exist
        return new Response('Not Found', { status: 404 });
      }
    }
  },
};
