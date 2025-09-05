import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/session';

export async function POST() {
  const user = await requireUser();
  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: false, twoFactorSecret: null, }
  });
  return NextResponse.json({ message: '2FA disabled' });
}
