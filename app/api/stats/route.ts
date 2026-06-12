import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      alumni: 5000,
      years: 15,
      programs: 5,
      partners: 50,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
