// app/api/auth/2fa/setup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { requireUser } from "@/lib/session";

export async function POST() {
  const session = await requireUser();
  if (!session?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const secret = speakeasy.generateSecret({
    name: `NextAuthStarter:${session.email}`,
  });

  // Save secret temp in DB (mark as pending until verified)
  await prisma.user.update({
    where: { id: session.id },
    data: {
      twoFactorSecret: secret.base32,
      twoFactorEnabled: false,
    },
  });

  const qr = await QRCode.toDataURL(secret.otpauth_url!);

  return NextResponse.json({ qr, secret: secret.base32 });
}
