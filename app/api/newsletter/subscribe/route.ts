import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email } = data;

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.active) {
        const updated = await prisma.newsletterSubscriber.update({
          where: { email },
          data: { active: true },
        });
        return NextResponse.json(updated);
      }
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        active: true,
      },
    });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
