'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';

interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  eventDate: string;
}

export default function EventsPage() {
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
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredEvents = events.filter((e) => {
    if (activeFilter === 'all') return true;
    return e.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section className="py-24 px-6 bg-off-white flex-grow">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Campus Happenings</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-navy mt-2">Events & Activities</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-2 max-w-md mx-auto">Stay connected with our calendar, including workshops, futsal matches, and outreach programs.</p>
        </div>

        <div className="flex justify-center flex-wrap gap-2.5 mb-12">
          {['all', 'academic', 'sports', 'cultural', 'community'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer capitalize ${
                activeFilter === cat
                  ? 'bg-navy border-navy text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-navy hover:border-navy hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((item) => (
              <Card key={item.id} className="overflow-hidden p-0 flex flex-col hover:-translate-y-1.5 transition-all duration-300">
                <div className="h-44 bg-gray-100 flex items-center justify-center text-6xl relative select-none">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    getCategoryEmoji(item.category)
                  )}
                  <span className="absolute top-4 left-4 bg-gold text-navy text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <div className="p-6 text-left flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-gray-500 block mb-2 font-medium">{getFormatDate(item.eventDate)}</span>
                    <h3 className="text-base font-bold text-navy mb-3 leading-snug">{item.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center text-gray-500 text-sm py-12">
              No events found matching this category.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
