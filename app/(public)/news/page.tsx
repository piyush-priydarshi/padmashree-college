'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  createdAt: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 6;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/news?page=${currentPage}&limit=${limit}&category=${activeCategory}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setNews(data.news);
          setTotalPages(data.pages || 1);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentPage, activeCategory]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const getFormatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryEmoji = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic': return '📋';
      case 'research': return '📖';
      case 'admissions': return '🎓';
      default: return '📢';
    }
  };

  return (
    <section className="py-24 px-6 bg-off-white flex-grow">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Latest Publications</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-navy mt-2">News & Announcements</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-2 max-w-md mx-auto">Stay up to date with the latest newsletters, admissions notices, and innovation logs.</p>
        </div>

        <div className="flex justify-center flex-wrap gap-2.5 mb-12">
          {['All', 'Academic', 'Research', 'Admissions', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer capitalize ${
                activeCategory === cat
                  ? 'bg-navy border-navy text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-navy hover:border-navy hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {news.map((item) => (
                <Card key={item.id} className="p-0 overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300">
                  <div className="h-44 bg-navy-light/10 flex items-center justify-center text-5xl relative">
                    <span className="select-none">{getCategoryEmoji(item.category)}</span>
                    <span className="absolute top-4 left-4 bg-gold text-navy text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between text-left">
                    <div>
                      <span className="text-[11px] text-gray-500 block mb-2 font-medium">{getFormatDate(item.createdAt)}</span>
                      <h3 className="text-base font-bold text-navy mb-3 line-clamp-2 leading-snug">{item.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">{item.excerpt}</p>
                    </div>
                    <Link href={`/news/${item.slug}`} className="text-xs font-bold text-navy hover:text-gold transition-colors inline-flex items-center gap-1 cursor-pointer">
                      Read Full Article <span>→</span>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="bg-white border border-gray-200 px-4 py-2 rounded-md text-xs font-semibold hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-600 font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="bg-white border border-gray-200 px-4 py-2 rounded-md text-xs font-semibold hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-500 text-sm py-12">
            No news articles found in this category.
          </div>
        )}
      </div>
    </section>
  );
}
