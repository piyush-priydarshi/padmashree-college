'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
}

export default function AnnouncementBar() {
  const [notices, setNotices] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch('/api/news?limit=4')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.news) {
          setNotices(data.news);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-navy text-gray-400 text-[13px] px-6 py-2 flex items-center justify-between h-9 z-[1001] border-b border-white/5 md:flex hidden">
      <div className="flex items-center gap-1.5 text-gold font-bold tracking-wider">
        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-ping"></span>
        <span>LIVE</span>
      </div>
      <div className="flex-1 overflow-hidden whitespace-nowrap mx-8 relative">
        <div className="inline-block animate-ticker">
          {notices.length > 0 ? (
            [...notices, ...notices].map((notice, idx) => (
              <span key={`${notice.id}-${idx}`} className="inline-block pr-12 text-gray-200">
                {notice.title}
              </span>
            ))
          ) : (
            <>
              <span className="inline-block pr-12 text-gray-200">Admission Open 2027 — No Entrance Exam for BIT</span>
              <span className="inline-block pr-12 text-gray-200">Final Exam Timetable July 2026 Published</span>
              <span className="inline-block pr-12 text-gray-200">Annual Journal of Technology Innovation Released</span>
              <span className="inline-block pr-12 text-gray-200">B.Tech Food Second Semester Classes Commence Soon</span>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <Link href="/news" className="hover:text-gold transition-colors font-medium">News</Link>
        <a href="#" className="hover:text-gold transition-colors font-medium">Downloads</a>
        <a href="/contact" className="hover:text-gold transition-colors font-medium">Careers</a>
      </div>
    </div>
  );
}
