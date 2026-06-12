'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useReveal } from '@/hooks/useReveal';
import { Card } from '@/components/ui/Card';

interface RecentPhoto {
  id: string;
  imageUrl: string;
  caption: string | null;
  album: {
    id: string;
    title: string;
  };
}

export default function GalleryPreview() {
  const { ref, isVisible } = useReveal();
  const [photos, setPhotos] = useState<RecentPhoto[]>([]);

  useEffect(() => {
    fetch('/api/gallery?recent=4')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setPhotos(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (photos.length === 0) return null;

  return (
    <section
      ref={ref}
      className={`py-24 px-6 bg-white transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4 text-left">
          <div>
            <span className="text-xs font-semibold tracking-widest text-gold uppercase">Visual Highlights</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">Photo Gallery Preview</h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs font-bold text-navy hover:text-gold transition-colors inline-flex items-center gap-1 shrink-0"
          >
            View Full Gallery <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <Link key={photo.id} href={`/gallery/${photo.album.id}`} className="group block">
              <Card
                className="p-0 overflow-hidden relative h-64 border border-gray-200 shadow-sm cursor-pointer"
                hoverable={false}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || photo.album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                  <span className="text-[9px] font-bold text-gold uppercase tracking-wider mb-1">
                    {photo.album.title}
                  </span>
                  {photo.caption && (
                    <p className="text-xs font-semibold text-white leading-snug">{photo.caption}</p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
