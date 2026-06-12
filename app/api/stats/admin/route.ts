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

    const [
      applications, 
      unreadMessages, 
      subscribers, 
      news,
      totalAlbums,
      totalPhotos
    ] = await Promise.all([
      prisma.application.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.newsletterSubscriber.count({ where: { active: true } }),
      prisma.news.count(), // total news posts
      prisma.galleryAlbum.count(), // total albums
      prisma.galleryPhoto.count(), // total photos
    ]);

    return NextResponse.json({
      applications,
      unreadMessages,
      subscribers,
      news,
      totalAlbums,
      totalPhotos,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 });
  }
}
