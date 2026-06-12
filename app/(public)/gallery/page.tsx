'use client';

import React, { useEffect, useState } from 'react';

interface GalleryItem {
  id: string;
  url: string;
  caption: string | null;
  category: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxImg, setLightboxImg] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setImages(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredImages = images.filter((img) => {
    if (activeFilter === 'all') return true;
    return img.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <>
      <section className="py-24 px-6 bg-white flex-grow">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-gold uppercase">Visual Showcase</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-navy mt-2">Campus Gallery</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-2 max-w-md mx-auto">Explore our infrastructure, advanced computer and culinary labs, and student activities.</p>
          </div>

          <div className="flex justify-center flex-wrap gap-2.5 mb-12">
            {['all', 'classroom', 'labs', 'campus', 'events'].map((cat) => (
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

          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxImg(img)}
                  className="group relative h-64 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <img
                    src={img.url}
                    alt={img.caption || 'Campus photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-wider mb-1">{img.category}</span>
                    <p className="text-sm font-semibold text-white leading-tight">{img.caption || 'Padmashree Campus View'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm py-12">
              No gallery images found in this category.
            </div>
          )}
        </div>
      </section>

      {lightboxImg && (
        <div className="fixed inset-0 z-[9999] bg-navy/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setLightboxImg(null)}
          />
          <div className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center z-10 text-center">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-[-40px] right-0 text-white hover:text-gold text-3xl font-bold transition-colors cursor-pointer"
            >
              &times;
            </button>
            <div className="bg-navy-mid border border-white/10 rounded-2xl p-3 shadow-2xl flex flex-col overflow-hidden max-h-[75vh]">
              <img
                src={lightboxImg.url}
                alt={lightboxImg.caption || 'Campus view'}
                className="w-full h-full object-contain max-h-[60vh] rounded-lg"
              />
              <div className="mt-4 px-4 py-2 text-left">
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider block mb-1">{lightboxImg.category}</span>
                <p className="text-base font-semibold text-white leading-snug">{lightboxImg.caption || 'Padmashree College Kathmandu'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
