'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface AlbumItem {
  id: string;
  title: string;
  description: string | null;
  coverImage: string;
  createdAt: string;
  _count: {
    photos: number;
  };
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load albums');
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) {
          setAlbums(data);
        } else {
          setError(data.error || 'Failed to fetch albums');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('An error occurred while fetching the gallery.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center flex-grow">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 px-6 text-center flex-grow flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Gallery</h2>
        <p className="text-sm text-gray-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="bg-navy text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-navy-light transition-all">
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="py-24 px-6 bg-off-white flex-grow">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">Visual Showcase</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-navy mt-2">Campus Gallery</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Explore our albums detailing campus life, classrooms, laboratories, events, and student highlights.
          </p>
        </div>

        {albums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {albums.map((album) => (
              <Link key={album.id} href={`/gallery/${album.id}`}>
                <Card className="p-0 overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 border border-gray-200 shadow-sm cursor-pointer flex flex-col h-full bg-white" hoverable={false}>
                  <div className="relative h-56 bg-gray-100 overflow-hidden border-b border-gray-100">
                    <img
                      src={album.coverImage}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-navy/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gold">
                      🖼️ {album._count.photos} {album._count.photos === 1 ? 'Photo' : 'Photos'}
                    </div>
                  </div>
                  <div className="p-6 text-left flex flex-col flex-grow">
                    <h3 className="font-serif text-lg font-bold text-navy group-hover:text-gold transition-colors mb-2">
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed flex-grow">
                        {album.description}
                      </p>
                    )}
                    <span className="text-[10px] font-semibold text-gray-400 mt-4 block">
                      Created on {new Date(album.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm py-16">
            No photo albums have been published yet.
          </div>
        )}
      </div>
    </section>
  );
}
