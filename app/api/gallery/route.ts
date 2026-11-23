import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { validateImageFile, isValidImageUrl } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recent = searchParams.get('recent');

    if (recent) {
      const limit = parseInt(recent, 10) || 4;
      const photos = await prisma.galleryPhoto.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          album: {
            select: { id: true, title: true }
          }
        }
      });
      return NextResponse.json(photos);
    }

    const albums = await prisma.galleryAlbum.findMany({
      include: {
        _count: {
          select: { photos: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(albums);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch albums' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let title = '';
    let description = '';
    let coverImage = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      title = (formData.get('title') as string) || '';
      description = (formData.get('description') as string) || '';
      const file = formData.get('file') as File | null;

      if (!title) {
        return NextResponse.json({ error: 'Album title is required' }, { status: 400 });
      }

      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const validation = validateImageFile(file, buffer);
        if (!validation.valid) {
          return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'padmashree-gallery/covers' },
            (error, res) => {
              if (error) reject(error);
              else resolve(res as UploadApiResponse);
            }
          ).end(buffer);
        });
        coverImage = result.secure_url;
      } else {
        coverImage = (formData.get('coverImage') as string) || '';
      }
    } else {
      const body = await request.json();
      title = body.title;
      description = body.description || '';
      coverImage = body.coverImage;
    }

    if (!title || !coverImage) {
      return NextResponse.json({ error: 'Title and cover image are required' }, { status: 400 });
    }

    if (!isValidImageUrl(coverImage)) {
      return NextResponse.json({ error: 'Invalid cover image URL' }, { status: 400 });
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        title,
        description,
        coverImage
      }
    });

    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    console.error('Gallery Album creation error:', error);
    return NextResponse.json({ error: 'Failed to create album' }, { status: 500 });
  }
}
