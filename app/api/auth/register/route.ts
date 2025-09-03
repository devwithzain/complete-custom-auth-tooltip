import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { hashPassword } from "@/lib/crypto";
import { registerFormSchema } from '@/schemas';
import { sendEmailVerificationCode } from "@/lib/email";

function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, name, password: passwordHash }
  });

  const code = generate6DigitCode();
  const expires = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      code,
      type: 'EMAIL_VERIFY',
      expiresAt: expires
    }
  });

  try {
    await sendEmailVerificationCode(email, code);
  } catch (err) {
    console.error('Error sending verification email:', err);
  }

  return NextResponse.json({ message: 'Registered. Check email for 6-digit verification code.' });
}