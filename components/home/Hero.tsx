'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Particle {
  id: number;
  size: number;
  delay: number;
  duration: number;
  left: number;
}

export default function Hero() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const arr: Particle[] = [];
    for (let i = 0; i < 18; i++) {
      arr.push({
        id: i,
        size: Math.random() * 6 + 4,
        delay: Math.random() * 12,
        duration: Math.random() * 8 + 10,
        left: Math.random() * 100,
      });
    }
    const timer = setTimeout(() => {
      setParticles(arr);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen bg-navy flex items-center justify-center py-24 px-6 overflow-hidden">
      {/* Background Image with Ken Burns Zoom Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/hero-bg.jpg"
          alt="Padmashree College Campus"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-kenBurns"
        />
      </div>

      {/* Brand-Colored Gradient Overlays for High Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy-mid/65 z-1" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050e1c] via-[#050e1c]/40 to-transparent z-1" />

      {/* Accent Light Ray */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(245,166,35,0.06)_0%,transparent_60%)] pointer-events-none z-1" />

      <div className="absolute inset-0 pointer-events-none z-2">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-gold opacity-0 animate-[float-particle_15s_linear_infinite]"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-center gap-16 relative z-10 w-full">
        <div className="flex flex-col items-start text-left">
          <div className="border border-gold text-gold px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider mb-6 animate-fadeInUp">
            🎓 Admission Open 2027
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight animate-fadeInUp [animation-delay:0.2s]">
            Shape Your <span className="text-gold">Future</span> at Padmashree
          </h1>
          <p className="text-base md:text-lg text-gray-400 mb-8 max-w-lg leading-relaxed animate-fadeInUp [animation-delay:0.4s]">
            Established in 2007, Padmashree College offers world-class programs in IT, Hospitality, Business, and Food Technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto animate-fadeInUp [animation-delay:0.6s]">
            <Link href="/programs" className="bg-gold text-navy text-center font-semibold px-8 py-3.5 rounded-md hover:bg-gold-light transition-all shadow-md hover:-translate-y-0.5">
              Explore Programs →
            </Link>
            <Link href="/apply" className="border border-white/20 text-white text-center font-semibold px-8 py-3.5 rounded-md hover:bg-white/5 transition-all hover:-translate-y-0.5">
              Apply Online
            </Link>
          </div>
          <div className="flex gap-8 border-t border-white/5 pt-8 w-full animate-fadeInUp [animation-delay:0.8s]">
            <div>
              <span className="font-serif text-2xl md:text-3xl font-bold text-gold">15+</span>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Years of Excellence</p>
            </div>
            <div>
              <span className="font-serif text-2xl md:text-3xl font-bold text-gold">5000+</span>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Alumni</p>
            </div>
            <div>
              <span className="font-serif text-2xl md:text-3xl font-bold text-gold">5</span>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">Programs</p>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center items-center animate-fadeInRight">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 w-full max-w-md relative z-10 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 text-center">Our Programs</h3>
            <div className="flex flex-wrap gap-2.5 mb-8 justify-center">
              {['BIT', 'BHM', 'BBA', 'BCA', 'B.Tech Food'].map((p) => (
                <Link
                  key={p}
                  href={`/programs`}
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-semibold text-white hover:bg-gold hover:text-navy hover:border-gold transition-all duration-300"
                >
                  <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                  {p}
                </Link>
              ))}
            </div>
            <h4 className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold text-center mb-3.5">
              Affiliations
            </h4>
            <div className="flex justify-center gap-3">
              <span className="bg-[#050e1c]/60 border border-white/5 px-3.5 py-1.5 rounded-full text-[11px] text-gray-200">
                Tribhuvan University
              </span>
              <span className="bg-[#050e1c]/60 border border-white/5 px-3.5 py-1.5 rounded-full text-[11px] text-gray-200">
                Nilai University, Malaysia
              </span>
            </div>
          </div>

          <div className="absolute bottom-[-16px] left-[-24px] bg-white rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-[float_6s_ease-in-out_infinite] z-20 md:flex hidden">
            <span className="text-2xl">🏆</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-navy leading-tight">Top Ranked</span>
              <span className="text-[10px] text-gray-500">IT College, Kathmandu</span>
            </div>
          </div>

          <div className="absolute top-[-16px] right-[-24px] bg-white rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-[float_6s_ease-in-out_infinite] [animation-delay:3s] z-20 md:flex hidden">
            <span className="text-2xl">✅</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-navy leading-tight">No Entrance Exam</span>
              <span className="text-[10px] text-gray-500 font-medium">For BIT Program</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
