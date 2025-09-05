import { prisma } from "@/lib/db";
import { codeSchema } from "@/schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
   const body = await req.json();
   const { email, code } = body;
   const parsed = codeSchema.safeParse({ code });
   if (!email || !parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

   const user = await prisma.user.findUnique({ where: { email } });
   if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

   const token = await prisma.verificationToken.findFirst({
      where: { userId: user.id, code, type: "PASSWORD_RESET", expiresAt: { gt: new Date() }, consumedAt: null }
   });

   if (!token) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });

   return NextResponse.json({ success: true, message: "Code verified!" });
}