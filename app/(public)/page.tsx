import React from 'react';
import Hero from '@/components/home/Hero';
import StatsCounter from '@/components/home/StatsCounter';
import ProgramsSection from '@/components/home/ProgramsSection';
import AboutSection from '@/components/home/AboutSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import NewsSection from '@/components/home/NewsSection';
import EventsSection from '@/components/home/EventsSection';
import GalleryPreview from '@/components/home/GalleryPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsCounter />
      <ProgramsSection />
      <AboutSection />
      <FeaturesSection />
      <NewsSection />
      <EventsSection />
      <GalleryPreview />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
