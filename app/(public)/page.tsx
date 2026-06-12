import React from 'react';
import Hero from '@/components/home/Hero';
import StatsCounter from '@/components/home/StatsCounter';
import NewsSection from '@/components/home/NewsSection';
import ProgramsSection from '@/components/home/ProgramsSection';
import AboutSection from '@/components/home/AboutSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import EventsSection from '@/components/home/EventsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

export const revalidate = 0;

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsCounter />
      <NewsSection />
      <ProgramsSection />
      <AboutSection />
      <FeaturesSection />
      <EventsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
