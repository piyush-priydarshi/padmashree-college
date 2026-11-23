import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendMail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';

    const where: Prisma.ApplicationWhereInput = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { fullName, email, phone, program, message } = data;

    if (!fullName || !email || !phone || !program) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        fullName,
        email,
        phone,
        program,
        message,
        status: 'pending',
      },
    });

    try {
      await sendMail({
        to: email,
        subject: 'Application Received - Padmashree College',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0A1628;">Application Received</h2>
            <p>Dear ${fullName},</p>
            <p>Thank you for applying for the <strong>${program}</strong> program at Padmashree College, Tinkune, Kathmandu.</p>
            <p>Our admissions desk will review your credentials and contact you within the next 2-3 business days.</p>
            <p>If you have any urgent queries, feel free to call us at +977 1-4112252.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>Admissions Team</strong><br/>Padmashree College</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to send confirmation email:', emailErr);
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
