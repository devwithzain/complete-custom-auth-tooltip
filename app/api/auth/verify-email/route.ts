import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { emailVerifySchema } from '@/schemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = emailVerifySchema.safeParse({ code: body.code });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid code." },
        { status: 400 }
      );
    }

    const email = body.email;
    const code = parsed.data.code;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please check your email address." },
        { status: 404 }
      );
    }

    const token = await prisma.verificationToken.findFirst({
      where: {
        userId: user.id,
        code,
        type: "EMAIL_VERIFY",
        consumedAt: null,
        expiresAt: { gt: new Date() }
      }
    });

    if (!token) {
      return NextResponse.json(
        { error: "Invalid or expired verification code. Please request a new one." },
        { status: 400 }
      );
    }

    await prisma.verificationToken.update({
      where: { id: token.id },
      data: { consumedAt: new Date() }
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true }
    });

    return NextResponse.json({
      success: true,
      message: "Your email has been verified successfully. You can now log in."
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}