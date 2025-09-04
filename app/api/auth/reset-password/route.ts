import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/crypto";
import { resetPasswordSchema } from "@/schemas";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const { email, code, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Check code and mark as used (again for safety)
  const token = await prisma.verificationToken.findFirst({
    where: { userId: user.id, code, type: "PASSWORD_RESET", consumedAt: { not: null }, expiresAt: { gt: new Date() } }
  });
  if (!token) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });

  const passwordHash = await hashPassword(password);
  await prisma.user.update({ where: { id: user.id }, data: { password: passwordHash } });

  return NextResponse.json({ success: true, message: "Password updated!" });
}