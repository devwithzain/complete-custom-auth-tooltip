import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requestResetSchema } from '@/lib/schemas';
import { generateToken } from '@/lib/crypto';
import { sendPasswordReset } from '@/lib/email';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = requestResetSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = generateToken(32);
    const expires = new Date(Date.now() + 1000 * 60 * 30);
    await prisma.verificationToken.create({
      data: { userId: user.id, token, type: 'PASSWORD_RESET', expiresAt: expires }
    });
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;
    await sendPasswordReset(email, url);
  }

  return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' });
}
