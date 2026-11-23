import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendMail } from '@/lib/email';
import { escapeHtml } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const contactMsg = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@padmashreecollege.edu.np';
      const cleanSubject = subject.replace(/[\r\n]+/g, ' ').trim();
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safePhone = escapeHtml(phone || 'N/A');
      const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

      await sendMail({
        to: adminEmail,
        subject: `New Contact Inquiry: ${cleanSubject}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0A1628;">New Contact Inquiry Received</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Phone:</strong> ${safePhone}</p>
            <p><strong>Subject:</strong> ${escapeHtml(cleanSubject)}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #F0F2F7; padding: 15px; border-radius: 8px;">
              ${safeMessage}
            </div>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Failed to notify admin via email:', emailErr);
    }

    return NextResponse.json(contactMsg, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save contact message' }, { status: 500 });
  }
}
