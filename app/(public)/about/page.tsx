'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  const advisors = [
    { name: 'Dr. Ram Kumar Shrestha', role: 'Academic Advisor (Ex-TU Professor)' },
    { name: 'Prof. Rita Thapa', role: 'Senior Hospitality Advisory Council' },
    { name: 'Mr. Binod Kafle', role: 'Corporate Placement Advisor' },
  ];

  return (
    <div className="bg-white flex-grow">
      <section id="intro" className="py-20 px-6 bg-navy text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Introduction</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mt-2 mb-6">About Padmashree College</h1>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Padmashree College, located in Tinkune, Kathmandu, was established in 2007 with a commitment to providing advanced higher education. Our courses bridge academic excellence with immediate industrial relevance, cultivating global citizens equipped for modern professions.
          </p>
        </div>
      </section>

      <section id="chairperson" className="py-20 px-6 bg-off-white text-gray-800">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 items-center">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-navy rounded-2xl flex items-center justify-center text-6xl shadow-md border border-gray-200">
                👨‍🏫
              </div>
              <h4 className="font-bold text-navy mt-4 text-center">Chairperson</h4>
              <p className="text-[11px] text-gray-500 font-medium text-center">Padmashree Advisory Board</p>
            </div>
            <div className="text-left">
              <span className="text-xs font-semibold tracking-widest text-gold uppercase">Message from the Chair</span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy mt-2 mb-6">Leading with Purpose</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                &ldquo;At Padmashree College, our purpose extends beyond traditional classroom lessons. We aim to prepare students to be leaders who are technically competent and ethically grounded. Our international associations guarantee that our degrees carry global weight, giving our graduates a competitive edge in any market.&rdquo;
              </p>
              <p className="text-sm font-semibold text-navy">Advisory Committee, Padmashree College</p>
            </div>
          </div>
        </div>
      </section>

      <section id="advisors" className="py-20 px-6 bg-white text-gray-800">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Governance</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-navy mt-2 mb-12">Board of Advisors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advisors.map((adv, idx) => (
              <Card key={idx} className="text-center p-8 flex flex-col items-center">
                <div className="w-16 h-16 bg-gold-pale rounded-full flex items-center justify-center text-2xl mb-4 font-serif text-gold font-bold">
                  🎓
                </div>
                <h4 className="font-bold text-navy text-[15px]">{adv.name}</h4>
                <p className="text-[11px] text-gray-500 font-medium mt-1 leading-normal">{adv.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="vision" className="py-20 px-6 bg-off-white text-gray-800">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <span className="text-3xl mb-4 block">🎯</span>
              <h3 className="text-xl font-bold text-navy mb-4">Our Vision</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To be the most preferred educational group with high global recognition, preparing highly-skilled resources to lead and innovate within tomorrow&apos;s industrial markets.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <span className="text-3xl mb-4 block">⚡</span>
              <h3 className="text-xl font-bold text-navy mb-4">Our Mission</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To deliver practical infrastructure, direct industrial exposure, and individualized mentoring, nurturing students to become responsible, globally recognized citizens.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
