'use client';

import React, { useEffect, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';

interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  eventDate: string;
}

export default function EventsSection() {
  const { ref, isVisible } = useReveal();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setEvents(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const getCategoryEmoji = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'sports': return '⚽';
      case 'academic': return '💡';
      case 'cultural': return '🎭';
      case 'community': return '🌊';
      default: return '📅';
    }
  };

  const getFormatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredEvents = events.filter((e) => {
    if (activeFilter === 'all') return true;
    return e.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section
      ref={ref}
      className={`py-24 px-6 bg-navy transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      id="events"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Campus Life</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-2">Student Events & Activities</h2>
        </div>

        <div className="flex justify-center flex-wrap gap-3 mb-12">
          {['all', 'academic', 'sports', 'cultural', 'community'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer capitalize ${
                activeFilter === cat
                  ? 'bg-gold border-gold text-navy'
                  : 'bg-white/5 border-white/10 text-white hover:bg-gold hover:border-gold hover:text-navy'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((item) => (
              <div
                key={item.id}
                className="bg-navy-mid border border-white/8 hover:border-gold rounded-xl overflow-hidden shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-40 bg-white/5 flex items-center justify-center text-6xl relative select-none">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    getCategoryEmoji(item.category)
                  )}
                  <span className="absolute top-4 left-4 bg-gold text-navy text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs text-gray-400 block mb-2">{getFormatDate(item.eventDate)}</span>
                  <h4 className="text-[15px] font-bold text-white leading-snug">{item.title}</h4>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center text-gray-400 text-sm">
              No events found matching this category.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
