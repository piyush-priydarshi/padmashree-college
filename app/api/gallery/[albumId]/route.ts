import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ albumId: string }> }
) {
  try {
    const { albumId } = await context.params;

    const album = await prisma.galleryAlbum.findUnique({
      where: { id: albumId },
      include: {
        photos: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    return NextResponse.json(album);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ albumId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { albumId } = await context.params;
    const body = await request.json();
    const { title, description, coverImage } = body;

    const existing = await prisma.galleryAlbum.findUnique({
      where: { id: albumId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const updated = await prisma.galleryAlbum.update({
      where: { id: albumId },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update album' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ albumId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { albumId } = await context.params;

    const existing = await prisma.galleryAlbum.findUnique({
      where: { id: albumId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    await prisma.galleryAlbum.delete({
      where: { id: albumId },
    });

    return NextResponse.json({ message: 'Album deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 });
  }
}
