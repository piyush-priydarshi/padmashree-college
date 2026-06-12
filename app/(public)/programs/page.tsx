'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

interface ProgramItem {
  id: string;
  code: string;
  name: string;
  fullName: string;
  duration: string;
  description: string;
  highlights: string[];
  slug: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);

  useEffect(() => {
    fetch('/api/programs')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setPrograms(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const getEmoji = (code: string) => {
    switch (code.toUpperCase()) {
      case 'BIT': return '💻';
      case 'BHM': return '🏨';
      case 'BBA': return '📊';
      case 'BCA': return '🖥️';
      case 'BTECH': return '🧪';
      default: return '🎓';
    }
  };

  return (
    <section className="py-24 px-6 bg-off-white flex-grow">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Our Offerings</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-navy mt-2">Academic Programs</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-2 max-w-md mx-auto">Explore our industry-accredited courses designed for successful professional career development.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <Card key={prog.id} className="p-8 hover:-translate-y-1.5 transition-all duration-300">
              <div className="w-14 h-14 bg-gold-pale rounded-2xl flex items-center justify-center text-3xl mb-6">
                {getEmoji(prog.code)}
              </div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider block mb-1">{prog.duration}</span>
              <h3 className="text-xl font-bold text-navy mb-2">{prog.fullName} ({prog.code})</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed mb-6 line-clamp-3">{prog.description}</p>
              
              <Link href={`/programs/${prog.slug}`} className="text-sm font-semibold text-navy hover:text-gold transition-colors inline-flex items-center gap-1.5 cursor-pointer">
                View Program Details <span className="text-base">→</span>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
