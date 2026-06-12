import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ photoId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { photoId } = await context.params;
    const body = await request.json();
    const { caption, order } = body;

    const existing = await prisma.galleryPhoto.findUnique({
      where: { id: photoId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    const updated = await prisma.galleryPhoto.update({
      where: { id: photoId },
      data: {
        caption: caption !== undefined ? caption : existing.caption,
        order: order !== undefined ? parseInt(order, 10) : existing.order,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Gallery Photo update error:', error);
    return NextResponse.json({ error: 'Failed to update photo' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ photoId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { photoId } = await context.params;

    const existing = await prisma.galleryPhoto.findUnique({
      where: { id: photoId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    await prisma.galleryPhoto.delete({
      where: { id: photoId },
    });

    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Gallery Photo deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
