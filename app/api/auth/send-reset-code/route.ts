import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { emailSchema } from "@/schemas";
import { sendPasswordResetCodeEmail } from "@/lib/email"; // You have to implement this

function generate6DigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = emailSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Email not found" }, { status: 404 });

  const code = generate6DigitCode();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 min

  await prisma.verificationToken.create({
    data: { userId: user.id, code, type: "PASSWORD_RESET", expiresAt }
  });

  await sendPasswordResetCodeEmail(email, code);

  return NextResponse.json({ success: true, message: "Code sent!" });
}
