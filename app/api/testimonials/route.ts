import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin') === 'true';

    const where: Prisma.TestimonialWhereInput = {};
    if (!admin) {
      where.published = true;
    } else {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { name, initials, program, quote, published, order } = data;

    if (!name || !initials || !program || !quote) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        initials,
        program,
        quote,
        published: !!published,
        order: order !== undefined ? parseInt(order, 10) : 0,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
