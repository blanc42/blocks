import { db } from '$lib/database/index';
import { users } from '$lib/database/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dev } from '$app/environment';
import type { Cookies } from '@sveltejs/kit';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'auth_token';

export async function createUser(username: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [user] = await db.insert(users).values({
    username,
    email,
    passwordHash: hashedPassword,
  }).returning();
  console.log(user)
  return user;
}

export async function loginUser(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return null;

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) return null;

  return user;
}

export function createJWT(userId: number) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export function setAuthCookie(cookies: Cookies, token: string) {
    cookies.set('auth_token', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    });
}

export function clearAuthCookie(res: Response) {
  res.headers.set('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Strict; ${dev ? '' : 'Secure;'} Max-Age=0`);
}

export function getAuthCookie(req: Request) {
  const cookies = req.headers.get('cookie');
  if (!cookies) return null;
  const tokenCookie = cookies.split(';').find(c => c.trim().startsWith(`${COOKIE_NAME}=`));
  if (!tokenCookie) return null;
  return tokenCookie.split('=')[1];
}

export async function authenticateUser(req: Request) {
  const token = getAuthCookie(req);
  if (!token) return null;
  
  const userId = verifyJWT(token);
  if (!userId) return null;

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  return user || null;
}