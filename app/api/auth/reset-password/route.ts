import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/crypto";
import { resetPasswordSchema } from "@/schemas";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, code, password } = body;

  const parsed = resetPasswordSchema.safeParse({ password });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const token = await prisma.verificationToken.findFirst({
    where: {
      userId: user.id,
      code,
      type: "PASSWORD_RESET",
      consumedAt: null,
      expiresAt: { gt: new Date() }
    }
  });

  if (!token) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });

  await prisma.$transaction([
    prisma.verificationToken.update({
      where: { id: token.id },
      data: { consumedAt: new Date() }
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { password: await hashPassword(password) }
    })
  ]);

  return NextResponse.json({ success: true, message: "Password updated!" });
}