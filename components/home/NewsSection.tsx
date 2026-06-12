'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  createdAt: string;
}

export default function NewsSection() {
  const { ref, isVisible } = useReveal();
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch('/api/news?limit=10')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.news) {
          setAllNews(data.news);
          setFeaturedNews(data.news.slice(0, 3));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const getCategoryIcon = (category: string) => {
    return category === 'EVENT' ? '📅' : '📢';
  };

  const getFormatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <section
      ref={ref}
      className={`py-24 px-6 bg-off-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      id="news"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Stay Updated</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">News & Announcements</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-navy px-6 py-4 flex justify-between items-center text-white">
              <span className="text-[15px] font-bold tracking-wide">Latest Notices</span>
              <div className="inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold text-[#FF4A4A]">
                <span className="w-1.5 h-1.5 bg-[#FF4A4A] rounded-full animate-ping"></span>
                LIVE
              </div>
            </div>
            <div className="h-[340px] overflow-hidden relative">
              <div className="flex flex-col animate-scroll-up hover:[animation-play-state:paused]">
                {allNews.length > 0 ? (
                  [...allNews, ...allNews].map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="h-[85px] px-6 py-4 flex items-center gap-4 border-b border-gray-100 box-border">
                      <span className="bg-gold-pale text-gold text-[10px] font-bold px-3 py-1.5 rounded-md whitespace-nowrap">
                        {getFormatDate(item.createdAt)}
                      </span>
                      <Link href={`/news/${item.slug}`} className="text-[13px] text-gray-800 font-medium hover:text-gold transition-colors line-clamp-2 leading-relaxed">
                        {item.title}
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="h-[85px] px-6 py-4 flex items-center text-[13px] text-gray-500">
                    No notices available.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {featuredNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="bg-white border border-gray-200 border-l-4 border-l-navy hover:border-l-gold rounded-xl p-6 flex items-center gap-6 shadow-sm hover:shadow-md hover:translate-x-1 transition-all duration-300"
              >
                <span className="text-3xl">{getCategoryIcon(item.category)}</span>
                <div className="flex-1">
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block mb-1">{item.category}</span>
                  <h4 className="text-[15px] font-bold text-navy leading-snug">{item.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
