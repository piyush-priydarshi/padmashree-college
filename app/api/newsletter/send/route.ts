import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendMail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { subject, message } = data;

    if (!subject || !message) {
      return NextResponse.json({ error: 'Missing subject or message' }, { status: 400 });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { active: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'No active subscribers found' }, { status: 200 });
    }

    let successCount = 0;
    let failCount = 0;

    for (const sub of subscribers) {
      try {
        await sendMail({
          to: sub.email,
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
              <h2 style="color: #0A1628;">Padmashree Newsletter</h2>
              <div style="font-size: 14px; margin-bottom: 20px; white-space: pre-wrap;">
                ${message}
              </div>
              <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
              <p style="font-size: 11px; color: #888;">
                You are receiving this because you subscribed to updates from Padmashree College.
              </p>
            </div>
          `,
        });
        successCount++;
      } catch (err) {
        console.error(`Failed to send email to ${sub.email}:`, err);
        failCount++;
      }
    }

    return NextResponse.json({
      message: 'Newsletter sent',
      total: subscribers.length,
      successCount,
      failCount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
  }
}
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}
