import { cookies } from 'next/headers';
import { prisma } from './db';
import { generateToken } from './crypto';

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'auth_session';

export async function createSession(userId: string, ip?: string, userAgent?: string) {
  const token = generateToken(48);
  const maxAgeDays = 30;
  const expires = new Date(Date.now() + maxAgeDays * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt: expires,
      ip,
      userAgent
    }
  });

  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.AUTH_COOKIE_SECURE === 'true',
    sameSite: 'lax',
    expires
  });

  return token;
}

export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } });
    (await cookies()).delete(COOKIE_NAME);
    return null;
  }
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export async function destroySession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
    (await cookies()).delete(COOKIE_NAME);
  }
}
