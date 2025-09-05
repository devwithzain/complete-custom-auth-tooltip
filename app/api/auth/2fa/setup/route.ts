import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import speakeasy from "speakeasy";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";

export async function POST() {
  const session = await requireUser();
  if (!session?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const secret = speakeasy.generateSecret({
    name: `NextAuthStarter:${session.email}`,
  });

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
