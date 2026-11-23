import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NewsCategory, Prisma } from '@prisma/client';
import { sanitizeHtml } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const categoryQuery = searchParams.get('category') || '';
    const admin = searchParams.get('admin') === 'true';

    const skip = (page - 1) * limit;
    const where: Prisma.NewsWhereInput = {};

    if (categoryQuery && categoryQuery.toUpperCase() !== 'ALL') {
      let mappedCategory: NewsCategory | null = null;
      if (categoryQuery.toUpperCase() === 'ANNOUNCEMENT' || categoryQuery.toUpperCase() === 'ANNOUNCEMENTS') {
        mappedCategory = NewsCategory.ANNOUNCEMENT;
      } else if (categoryQuery.toUpperCase() === 'EVENT' || categoryQuery.toUpperCase() === 'EVENTS') {
        mappedCategory = NewsCategory.EVENT;
      }
      if (mappedCategory) {
        where.category = mappedCategory;
      }
    }

    if (!admin) {
      where.published = true;
    } else {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({
      news,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Fetch news error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { title, excerpt, content, category, coverImage, eventDate, published } = data;

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Title, content, and category are required' }, { status: 400 });
    }

    // Validate category
    let parsedCategory: NewsCategory;
    if (category === 'ANNOUNCEMENT' || category === 'Announcement') {
      parsedCategory = NewsCategory.ANNOUNCEMENT;
    } else if (category === 'EVENT' || category === 'Event') {
      parsedCategory = NewsCategory.EVENT;
    } else {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Validate eventDate if category is EVENT
    let parsedEventDate: Date | null = null;
    if (parsedCategory === NewsCategory.EVENT) {
      if (!eventDate) {
        return NextResponse.json({ error: 'Event date is required for events' }, { status: 400 });
      }
      parsedEventDate = new Date(eventDate);
      if (isNaN(parsedEventDate.getTime())) {
        return NextResponse.json({ error: 'Invalid event date' }, { status: 400 });
      }
    }

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.news.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content: sanitizeHtml(content),
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        category: parsedCategory,
        eventDate: parsedEventDate,
        published: !!published,
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('Create news error:', error);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
