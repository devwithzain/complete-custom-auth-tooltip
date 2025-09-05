import { prisma } from "@/lib/db";
import speakeasy from "speakeasy";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    const session = await requireUser();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.id } });
    if (!user?.twoFactorSecret) {
      return NextResponse.json({ error: "No 2FA setup" }, { status: 400 });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.id },
      data: { twoFactorEnabled: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
