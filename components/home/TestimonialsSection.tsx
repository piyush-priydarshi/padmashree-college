'use client';

import React, { useEffect, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

interface TestimonialItem {
  id: string;
  name: string;
  initials: string;
  program: string;
  quote: string;
}

export default function TestimonialsSection() {
  const { ref, isVisible } = useReveal();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setTestimonials(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (testimonials.length <= 3) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const slide1 = testimonials.slice(0, 3);
  const slide2 = testimonials.slice(3, 6);

  return (
    <section
      ref={ref}
      className={`py-24 px-6 bg-off-white transition-all duration-1000 overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Student Stories</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">What Our Alumni Say</h2>
        </div>

        {testimonials.length > 0 ? (
          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
              <div className="min-w-full w-full px-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {slide1.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[260px]"
                    >
                      <div>
                        <span className="font-serif text-4xl text-gold leading-none block mb-2">“</span>
                        <p className="text-[13.5px] text-gray-600 leading-relaxed mb-6">{item.quote}</p>
                      </div>
                      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-navy-mid to-navy-light text-gold text-xs font-bold rounded-full flex items-center justify-center">
                          {item.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-navy">{item.name}</span>
                          <span className="text-[11px] text-gray-500">{item.program}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {slide2.length > 0 && (
                <div className="min-w-full w-full px-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slide2.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-2xl p-8 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[260px]"
                      >
                        <div>
                          <span className="font-serif text-4xl text-gold leading-none block mb-2">“</span>
                          <p className="text-[13.5px] text-gray-600 leading-relaxed mb-6">{item.quote}</p>
                        </div>
                        <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-navy-mid to-navy-light text-gold text-xs font-bold rounded-full flex items-center justify-center">
                            {item.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-navy">{item.name}</span>
                            <span className="text-[11px] text-gray-500">{item.program}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {slide2.length > 0 && (
              <div className="flex justify-center gap-2 mt-10">
                <button
                  onClick={() => setSlideIndex(0)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    slideIndex === 0 ? 'w-6 bg-gold' : 'w-2 bg-gray-400'
                  }`}
                />
                <button
                  onClick={() => setSlideIndex(1)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    slideIndex === 1 ? 'w-6 bg-gold' : 'w-2 bg-gray-400'
                  }`}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm">No testimonials loaded.</div>
        )}
      </div>
    </section>
  );
}
