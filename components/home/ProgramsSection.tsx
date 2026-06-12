'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';

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

export default function ProgramsSection() {
  const { ref, isVisible } = useReveal();
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
    <section
      ref={ref}
      className={`py-24 px-6 bg-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      id="programs"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">What We Offer</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">Our Academic Programs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {programs.map((prog) => (
            <Link
              key={prog.id}
              href={`/programs/${prog.slug}`}
              className="group relative bg-white border border-gray-200 hover:border-transparent hover:shadow-2xl rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 overflow-hidden hover:-translate-y-1.5"
            >
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
              
              <div className="w-[60px] h-[60px] bg-gold-pale rounded-full flex items-center justify-center text-3xl mb-6 group-hover:bg-gold group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {getEmoji(prog.code)}
              </div>
              
              <h3 className="font-serif text-xl font-bold text-navy mb-1">{prog.name}</h3>
              <p className="text-[12px] text-gray-500 font-medium mb-4 min-h-[36px] flex items-center justify-center leading-tight">
                {prog.fullName}
              </p>
              
              <span className="bg-navy text-gold text-[10px] font-semibold px-3.5 py-1 rounded-full mb-6">
                {prog.duration}
              </span>
              
              <ul className="text-left w-full border-t border-gray-100 pt-5 flex flex-col gap-2.5">
                {prog.highlights.map((h, i) => (
                  <li key={i} className="text-[11px] text-gray-600 font-medium flex items-start gap-1.5 leading-relaxed">
                    <span className="text-gold font-bold">→</span>
                    {h}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
