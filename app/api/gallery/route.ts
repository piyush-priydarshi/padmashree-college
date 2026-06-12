import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';

    const where: any = {};
    if (category && category !== 'all') {
      where.category = category;
    }

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let url = '';
    let caption = '';
    let category = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      caption = (formData.get('caption') as string) || '';
      category = (formData.get('category') as string) || '';

      if (!file || !category) {
        return NextResponse.json({ error: 'Missing file or category' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'padmashree-gallery' },
          (error, res) => {
            if (error) reject(error);
            else resolve(res);
          }
        ).end(buffer);
      });
      url = result.secure_url;
    } else {
      const body = await request.json();
      url = body.url;
      caption = body.caption || '';
      category = body.category;
    }

    if (!url || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const image = await prisma.galleryImage.create({
      data: {
        url,
        caption,
        category,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Gallery upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
