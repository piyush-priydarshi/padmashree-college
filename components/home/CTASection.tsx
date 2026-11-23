'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CTASection() {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  useEffect(() => {
    const targetDate = new Date("August 30, 2026 00:00:00").getTime();

    const updateTimer = () => {
      const difference = targetDate - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00'
        });
        clearInterval(timerId);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
    };

    const timerId = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timerId);
  }, []);

  return (
    <section className="bg-navy py-24 px-6 text-center relative overflow-hidden" id="cta">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(circle,rgba(245,166,35,0.08)_0%,transparent_60%)] pointer-events-none z-1"></div>
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <span className="text-xs font-semibold tracking-widest text-gold uppercase">Limited Seats Available</span>
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-6 leading-tight">
          Start Your Journey Today
        </h2>
        <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
          Join Padmashree College for the 2027 academic intake. No entrance exam is required for the BIT program. Merit-based scholarships are open for early applicants.
        </p>

        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <div className="bg-white/5 border border-white/10 rounded-xl w-20 md:w-24 py-4 flex flex-col items-center">
            <span className="font-serif text-3xl md:text-4xl text-gold font-bold leading-none">{timeLeft.days}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1.5 font-semibold">Days</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl w-20 md:w-24 py-4 flex flex-col items-center">
            <span className="font-serif text-3xl md:text-4xl text-gold font-bold leading-none">{timeLeft.hours}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1.5 font-semibold">Hours</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl w-20 md:w-24 py-4 flex flex-col items-center">
            <span className="font-serif text-3xl md:text-4xl text-gold font-bold leading-none">{timeLeft.minutes}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1.5 font-semibold">Minutes</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl w-20 md:w-24 py-4 flex flex-col items-center">
            <span className="font-serif text-3xl md:text-4xl text-gold font-bold leading-none">{timeLeft.seconds}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-1.5 font-semibold">Seconds</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/apply" className="bg-gold text-navy font-semibold px-8 py-3.5 rounded-md hover:bg-gold-light transition-all shadow-md hover:-translate-y-0.5 text-sm">
            Apply Now — 2027 →
          </Link>
          <Link href="/contact" className="border border-white/20 text-white font-semibold px-8 py-3.5 rounded-md hover:bg-white/5 transition-all hover:-translate-y-0.5 text-sm">
            Schedule a Campus Visit
          </Link>
        </div>
      </div>
    </section>
  );
}
