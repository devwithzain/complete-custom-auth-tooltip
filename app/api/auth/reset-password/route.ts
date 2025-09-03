import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resetPasswordSchema } from '@/lib/schemas';
import { hashPassword } from '@/lib/crypto';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  const { token, password } = parsed.data;

  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.type !== 'PASSWORD_RESET') {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }
  if (record.expiresAt < new Date()) return NextResponse.json({ error: 'Token expired' }, { status: 400 });

  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.verificationToken.delete({ where: { id: record.id } })
  ]);

  return NextResponse.json({ message: 'Password updated' });
}
