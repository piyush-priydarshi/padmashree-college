import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const program = await prisma.program.findUnique({
    where: { slug }
  });

  if (!program) {
    notFound();
  }

  return (
    <section className="py-20 px-6 bg-off-white flex-grow flex items-center">
      <div className="container mx-auto max-w-4xl bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-sm my-8">
        <div className="flex flex-col items-start gap-4 mb-8">
          <Link href="/programs" className="text-xs font-semibold text-gray-500 hover:text-gold transition-colors inline-flex items-center gap-1">
            ← Back to Programs
          </Link>
          <span className="bg-gold-pale text-gold text-xs font-bold px-3 py-1 rounded-full">
            {program.duration} Program
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy leading-tight">
            {program.fullName} ({program.code})
          </h1>
          <p className="text-sm text-gray-600 font-medium leading-none">
            Affiliated with: <strong>{program.affiliatedWith}</strong>
          </p>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col gap-6 text-left">
          <div>
            <h3 className="text-lg font-bold text-navy mb-3">Overview</h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {program.description}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-navy mb-4">Program Highlights</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {program.highlights.map((h: string, i: number) => (
                <li key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-700 font-semibold flex items-start gap-2 leading-relaxed">
                  <span className="text-gold font-bold">✓</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-navy-mid border border-white/5 rounded-2xl p-8 text-center mt-6 flex flex-col items-center gap-4 text-white">
            <h4 className="text-lg font-bold text-white leading-tight">Ready to Take the Next Step?</h4>
            <p className="text-xs text-gray-400 max-w-md">
              Secure your seats for the upcoming 2027 academic year. No entrance examinations required for BIT candidates.
            </p>
            <Link href="/apply" className="bg-gold text-navy font-semibold px-8 py-3 rounded-md hover:bg-gold-light transition-all shadow-md text-xs mt-2 inline-block">
              Apply Now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
