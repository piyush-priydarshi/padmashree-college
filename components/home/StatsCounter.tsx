'use client';

import React, { useEffect, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

interface StatItemProps {
  target: number;
  suffix: string;
  label: string;
  trigger: boolean;
}

const StatItem: React.FC<StatItemProps> = ({ target, suffix, label, trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress);
      const current = Math.floor(ease * target);
      setCount(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [trigger, target]);

  return (
    <div className="bg-navy-mid p-10 text-center transition-colors duration-300 hover:bg-navy-light">
      <div className="font-serif text-5xl text-gold font-bold mb-2 leading-none">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-gray-400 font-medium tracking-wide">{label}</div>
    </div>
  );
};

export default function StatsCounter() {
  const { ref, isVisible } = useReveal();
  const [stats, setStats] = useState({ alumni: 5000, years: 15, programs: 5, partners: 50 });

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setStats(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <section ref={ref} className="bg-navy px-6 py-16">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <StatItem target={stats.years} suffix="+" label="Years of Education" trigger={isVisible} />
          <StatItem target={stats.alumni} suffix="+" label="Alumni Worldwide" trigger={isVisible} />
          <StatItem target={100} suffix="%" label="Placement Support" trigger={isVisible} />
          <StatItem target={stats.partners} suffix="+" label="Industry Partners" trigger={isVisible} />
        </div>
      </div>
    </section>
  );
}
