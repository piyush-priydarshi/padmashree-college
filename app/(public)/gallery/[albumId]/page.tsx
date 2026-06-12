'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface PhotoItem {
  id: string;
  imageUrl: string;
  caption: string | null;
  order: number;
}

interface AlbumData {
  id: string;
  title: string;
  description: string | null;
  coverImage: string;
  photos: PhotoItem[];
}

export default function AlbumDetailPage() {
  const params = useParams();
  const albumId = params?.albumId as string;

  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  useEffect(() => {
    if (!albumId) return;

    fetch(`/api/gallery/${albumId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load album photos');
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) {
          setAlbum(data);
        } else {
          setError(data.error || 'Failed to fetch photos');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch album details.');
      })
      .finally(() => setLoading(false));
  }, [albumId]);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center flex-grow">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="py-24 px-6 text-center flex-grow flex flex-col justify-center items-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-sm text-gray-500 mb-4">{error || 'Album not found'}</p>
        <Link href="/gallery" className="bg-navy text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-navy-light transition-all">
          Back to Gallery
        </Link>
      </div>
    );
  }

  const slides = album.photos.map((photo) => ({
    src: photo.imageUrl,
    title: photo.caption || album.title,
    description: photo.caption || undefined,
  }));

  return (
    <section className="py-24 px-6 bg-off-white flex-grow">
      <div className="container mx-auto max-w-6xl">
        <div className="text-left mb-10 flex flex-col items-start gap-4">
          <Link href="/gallery" className="text-xs font-semibold text-gray-500 hover:text-gold transition-colors flex items-center gap-1">
            ← Back to Gallery
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy">{album.title}</h1>
            {album.description && (
              <p className="text-xs md:text-sm text-gray-600 mt-2 max-w-xl leading-relaxed">
                {album.description}
              </p>
            )}
          </div>
        </div>

        {album.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {album.photos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative h-60 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                  {photo.caption ? (
                    <p className="text-xs font-semibold text-white leading-snug">{photo.caption}</p>
                  ) : (
                    <p className="text-xs text-gray-300">View Photo</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 text-sm py-16 bg-white border border-gray-200 rounded-2xl shadow-sm">
            No photos have been added to this album yet.
          </div>
        )}
      </div>

      <Lightbox
        index={lightboxIndex}
        slides={slides}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
      />
    </section>
  );
}
