import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NewsCategory, Prisma } from '@prisma/client';
import { sanitizeHtml } from '@/lib/security';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const news = await prisma.news.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    });

    if (!news) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    if (!news.published) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'News not found' }, { status: 404 });
      }
    }

    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const data = await request.json();
    const { title, excerpt, content, category, coverImage, eventDate, published } = data;

    const existingNews = await prisma.news.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    });

    if (!existingNews) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    const updateData: Prisma.NewsUpdateInput = {};

    if (excerpt !== undefined) updateData.excerpt = excerpt || null;
    if (content !== undefined) updateData.content = sanitizeHtml(content);
    if (coverImage !== undefined) updateData.coverImage = coverImage || null;
    if (published !== undefined) updateData.published = !!published;

    let parsedCategory = existingNews.category;
    if (category !== undefined) {
      if (category === 'ANNOUNCEMENT' || category === 'Announcement') {
        parsedCategory = NewsCategory.ANNOUNCEMENT;
      } else if (category === 'EVENT' || category === 'Event') {
        parsedCategory = NewsCategory.EVENT;
      } else {
        return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
      }
      updateData.category = parsedCategory;
    }

    if (parsedCategory === NewsCategory.EVENT) {
      // eventDate is required for EVENT category
      const checkDate = eventDate !== undefined ? eventDate : existingNews.eventDate;
      if (!checkDate) {
        return NextResponse.json({ error: 'Event date is required for events' }, { status: 400 });
      }
      const parsedEventDate = new Date(checkDate);
      if (isNaN(parsedEventDate.getTime())) {
        return NextResponse.json({ error: 'Invalid event date' }, { status: 400 });
      }
      updateData.eventDate = parsedEventDate;
    } else {
      // Clear eventDate if switched back to ANNOUNCEMENT
      updateData.eventDate = null;
    }

    if (title && title !== existingNews.title) {
      updateData.title = title;
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.news.findFirst({ where: { slug, id: { not: existingNews.id } } })) {
        slug = `${baseSlug}-${counter++}`;
      }
      updateData.slug = slug;
    }

    const updated = await prisma.news.update({
      where: { id: existingNews.id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update news error:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const existing = await prisma.news.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    });

    if (!existing) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    await prisma.news.delete({
      where: { id: existing.id }
    });

    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
