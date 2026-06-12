'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';

interface AccordionItem {
  title: string;
  content: string;
}

export default function AboutSection() {
  const { ref, isVisible } = useReveal();
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  const accordionItems: AccordionItem[] = [
    {
      title: 'Our Vision',
      content: 'To be the most preferred educational group with high global recognition, preparing skilled resources to lead tomorrow\'s industries.',
    },
    {
      title: 'Our Mission',
      content: 'To deliver high-end, practical infrastructure and direct exposure, nurturing students to become responsible, globally recognized citizens.',
    },
    {
      title: 'Key Features',
      content: 'Personalized mentoring models, active labs and internship drives, globally recognized accreditations, dynamic sports leagues, and multi-disciplinary research programs.',
    },
  ];

  const handleToggle = (idx: number) => {
    setActiveIdx(activeIdx === idx ? null : idx);
  };

  return (
    <section
      ref={ref}
      className={`py-24 px-6 bg-off-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      id="about"
    >
      <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-20 items-center">
        <div className="relative h-[440px] md:w-[500px] w-full mx-auto lg:mx-0">
          <div className="w-[85%] h-[380px] bg-gradient-to-br from-navy-mid to-navy-light rounded-2xl flex items-center justify-center relative overflow-hidden shadow-lg">
            <span className="text-[100px] z-10 select-none">🏫</span>
            <span className="absolute bottom-[-30px] right-[-30px] text-[200px] opacity-[0.05] pointer-events-none select-none">🎓</span>
          </div>
          
          <div className="absolute bottom-0 right-[10px] w-[55%] h-[200px] bg-gold-pale border-4 border-white rounded-2xl shadow-2xl flex items-center justify-center z-20">
            <span className="text-[60px] select-none">🌏</span>
          </div>

          <div className="absolute top-[-10px] right-[10%] bg-gold text-navy px-5 py-3.5 rounded-xl shadow-md text-center z-30">
            <div className="font-serif text-3xl font-bold leading-none">2007</div>
            <div className="text-[11px] font-bold uppercase tracking-wider mt-0.5">Established</div>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Who We Are</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2 mb-6 leading-tight">
            Shaping Nepal's Future Since 2007
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-5 leading-relaxed">
            Founded in 2007, Padmashree College provides world-class higher education in IT, Hospitality, Business Management, and Food Technology. We strive to merge academic rigor with direct industrial relevance.
          </p>
          <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
            Through solid affiliations, we empower over 5000+ alumni to achieve high placement records in international markets, research hubs, and dynamic tech corporations.
          </p>

          <div className="w-full flex flex-col gap-3.5 mb-8">
            {accordionItems.map((item, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  <div
                    onClick={() => handleToggle(idx)}
                    className={`px-5 py-4 flex justify-between items-center text-sm font-semibold cursor-pointer transition-all duration-300 ${
                      isActive ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.title}</span>
                    <span className="text-lg leading-none font-medium">{isActive ? '−' : '+'}</span>
                  </div>
                  <div
                    className="overflow-hidden transition-all duration-350 ease-out"
                    style={{ maxHeight: isActive ? '180px' : '0' }}
                  >
                    <div className="px-5 py-4 text-[13px] text-gray-600 bg-off-white leading-relaxed border-t border-gray-100">
                      {item.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/about" className="bg-gold text-navy font-semibold px-8 py-3.5 rounded-md hover:bg-gold-light transition-all shadow-md hover:-translate-y-0.5">
            Learn More About Us →
          </Link>
        </div>
      </div>
    </section>
  );
}
