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
      return NextResponse.json({ error: 'Input validation failed' }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Email not found' }, { status: 401 });
    }

    const passwordCheck = await verifyPassword(password, user.password);

    if (!passwordCheck) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // if (user.twoFactorEnabled) {
    //   console.log('2FA required for user:', email);
    //   return NextResponse.json({ message: '2FA required', twoFactor: true }, { status: 412 });
    // }

    const ipInfoRes = await fetch('https://ipinfo.io/json');
    if (ipInfoRes.ok) {
      const ipInfo = await ipInfoRes.json();
      const userAgent = req.headers.get('user-agent') || '';
      await createSession(user.id, ipInfo.ip ?? undefined, `${userAgent}`);
      if (!user.emailVerified) {
        return NextResponse.json(
          { message: 'Email not verified' },
          { status: 403 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Logged in successfully'
      }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Could not fetch IP info' }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}