import { NextRequest } from 'next/server';
import { withRole } from '@/lib/role-middleware';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return withRole(req, ['ADMIN'], async (req, user) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          twoFactorEnabled: true,
        }
      });

      return NextResponse.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(req: NextRequest) {
  return withRole(req, ['ADMIN'], async (req, user) => {
    try {
      const { userId, role } = await req.json();

      if (!userId || !role) {
        return NextResponse.json(
          { error: 'User ID and role are required' },
          { status: 400 }
        );
      }

      if (!['USER', 'ADMIN', 'SELLER'].includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          twoFactorEnabled: true,
        }
      });

      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error('Update user role error:', error);
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 500 }
      );
    }
  });
}
