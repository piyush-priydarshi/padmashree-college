import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ albumId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { albumId } = await context.params;

    const album = await prisma.galleryAlbum.findUnique({
      where: { id: albumId }
    });

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let imageUrl = '';
    let caption = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      caption = (formData.get('caption') as string) || '';
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ error: 'Missing image file' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: `padmashree-gallery/${albumId}` },
          (error, res) => {
            if (error) reject(error);
            else resolve(res);
          }
        ).end(buffer);
      });
      imageUrl = result.secure_url;
    } else {
      const body = await request.json();
      imageUrl = body.imageUrl;
      caption = body.caption || '';
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Determine the next order index
    const maxOrderPhoto = await prisma.galleryPhoto.findFirst({
      where: { albumId },
      orderBy: { order: 'desc' },
      select: { order: true }
    });
    
    const nextOrder = maxOrderPhoto ? maxOrderPhoto.order + 1 : 0;

    const photo = await prisma.galleryPhoto.create({
      data: {
        albumId,
        imageUrl,
        caption,
        order: nextOrder
      }
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Gallery Photo upload error:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}
