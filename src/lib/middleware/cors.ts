import type { Handle } from '@sveltejs/kit';

export const corsMiddleware: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: response.headers
    });
  }
  
  return response;
};