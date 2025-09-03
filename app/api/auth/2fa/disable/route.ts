import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/session';
import { prisma } from '@/lib/db';

export async function POST() {
  const user = await requireUser();
  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorEnabled: false, twoFactorSecret: null, twoFactorBackup: [] }
  });
  return NextResponse.json({ message: '2FA disabled' });
}
