import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { emailSchema } from '@/schemas';
import { sendEmailVerificationCode } from "@/lib/email";
import { generate6DigitCode } from "@/lib/generate-code";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = emailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Delete old verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: {
        userId: user.id,
        type: 'EMAIL_VERIFY'
      }
    });

    // Create new verification token
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

    await sendEmailVerificationCode(email, code);
    
    return NextResponse.json({
      success: true,
      message: "Verification code sent. Check your email."
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
