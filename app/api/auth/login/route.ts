import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { loginFormSchema } from '@/schemas';
import { verifyPassword } from '@/lib/crypto';
import { createSession } from '@/lib/session';

export async function POST(req: Request) {

  try {
    const body = await req.json();
    const parsed = loginFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.warn('Login failed: user not found for email', email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await verifyPassword(password, user.password);

    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.twoFactorEnabled) {
      console.log('2FA required for user:', email);
      // 412 Precondition Required -> client must verify 2FA
      return NextResponse.json({ message: '2FA required' }, { status: 412 });
    }

    const ipInfoRes = await fetch(`https://ipinfo.io/json`);
    if (ipInfoRes.ok) {
      const ipInfo = await ipInfoRes.json();

      const userAgent = req.headers.get('user-agent') || '';
      await createSession(user.id, ipInfo.ip ?? undefined, `${userAgent}`);
      return NextResponse.json({ message: 'Logged in' });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
