import type { Handle } from '@sveltejs/kit';
import { authenticateUser } from '$lib/auth';

export const authMiddleware: Handle = async ({ event, resolve }) => {
  const user = await authenticateUser(event.request);
  event.locals = { ...event.locals, user };

  console.log(user)

  console.log("this middleware is running")
  
  return resolve(event);
};