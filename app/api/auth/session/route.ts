import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  const { id, email, name, emailVerifiedAt, twoFactorEnabled } = user;
  return NextResponse.json({ user: { id, email, name, emailVerifiedAt, twoFactorEnabled } });
}
