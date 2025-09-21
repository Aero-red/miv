import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// PUT /api/notifications/mark-all-read - Mark all notifications as read for current user
export async function PUT(request: NextRequest) {
  try {
    // Disable authentication for development
    // const session = await getServerSession();
    // if (!session?.user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Build where clause - if no userId provided, update all notifications
    const where: any = {};
    if (userId) {
      where.userId = userId;
    }

    // Update all notifications to mark as read
    const result = await prisma.notification.updateMany({
      where: {
        ...where,
        isRead: false // Only update unread notifications
      },
      data: {
        isRead: true
      }
    });

    return NextResponse.json({
      success: true,
      message: `Marked ${result.count} notifications as read`,
      updatedCount: result.count
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

