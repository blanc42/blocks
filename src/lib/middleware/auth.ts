import type { Handle } from '@sveltejs/kit';
import { authenticateUser } from '$lib/auth';

export const authMiddleware: Handle = async ({ event, resolve }) => {
  const user = await authenticateUser(event.request);
  event.locals = { ...event.locals, user };

  if (!user && !event.url.pathname.startsWith("/login") && !event.url.pathname.startsWith("/signup")) {
    return Response.redirect(new URL("/login", event.url));
  }
  
  return resolve(event);
};