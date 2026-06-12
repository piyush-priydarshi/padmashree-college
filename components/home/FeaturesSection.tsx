'use client';

import React from 'react';
import { useReveal } from '@/hooks/useReveal';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

export default function FeaturesSection() {
  const { ref, isVisible } = useReveal();

  const features: FeatureCard[] = [
    {
      icon: '🏛️',
      title: 'Excellent Amenities',
      description: 'Modern classrooms, sophisticated IT and culinary labs, library facilities, and vibrant recreational zones.',
    },
    {
      icon: '🎯',
      title: 'Individual-Curated Learning',
      description: 'Small classrooms designed to maximize interaction, offering dedicated guidance for every student.',
    },
    {
      icon: '🌍',
      title: 'International Recognition',
      description: 'Accredited degrees globally valid with strong academic affiliations with TU and Nilai University Malaysia.',
    },
    {
      icon: '🤝',
      title: 'Counseling & Guidance',
      description: 'Dedicated academic counselors to structure job routes, soft skills training, and CV clinics.',
    },
    {
      icon: '🎭',
      title: 'Co-Curricular Activities',
      description: 'Clubs, cultural leagues, hackathons, and global culinary fests hosting industry veterans.',
    },
    {
      icon: '⚽',
      title: 'Sports & Recreation',
      description: 'Futsal matches, indoor cricket series, and active wellness clubs highlighting campus fitness.',
    },
  ];

  return (
    <section
      ref={ref}
      className={`py-24 px-6 bg-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      id="features"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">The Padmashree Advantage</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-gold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl mb-5">{feat.icon}</div>
              <h3 className="text-lg font-bold text-navy mb-3">{feat.title}</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
