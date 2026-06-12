import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [applications, unreadMessages, subscribers, news] = await Promise.all([
      prisma.application.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
      prisma.news.count({ where: { published: true } }),
    ]);

    return NextResponse.json({
      applications,
      unreadMessages,
      subscribers,
      news,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
