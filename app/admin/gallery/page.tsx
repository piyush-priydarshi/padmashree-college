'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface GalleryItem {
  id: string;
  url: string;
  caption: string | null;
  category: string;
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('classroom');

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [uploading, setUploading] = useState(false);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (!data.error) {
        setImages(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('Image deleted successfully!');
        setToastType('success');
        loadGallery();
      } else {
        setToastMsg('Failed to delete image.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setToastMsg('Please select a file to upload.');
      setToastType('error');
      return;
    }
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);
      formData.append('category', category);

      const res = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg('Image uploaded and saved successfully!');
        setToastType('success');
        setIsModalOpen(false);
        setFile(null);
        setCaption('');
        loadGallery();
      } else {
        setToastMsg(data.error || 'Failed to upload image.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Failed to connect to the server.');
      setToastType('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy">Campus Gallery Management</h1>
          <p className="text-xs text-gray-500 mt-1">Upload campus, lab, and class photos directly to Cloudinary storage.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="text-xs py-2.5 px-4">
          + Upload Photo
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.length > 0 ? (
            images.map((img) => (
              <div
                key={img.id}
                className="group relative h-56 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
              >
                <img src={img.url} alt={img.caption || 'Campus photo'} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-left">
                  <span className="bg-gold text-navy text-[9px] font-bold px-2 py-0.5 rounded self-start uppercase">
                    {img.category}
                  </span>
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-xs text-white truncate max-w-[150px] font-semibold">{img.caption || 'Campus view'}</p>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 text-sm">
              No gallery images found.
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Campus Photo">
        <form onSubmit={handleUpload} className="flex flex-col gap-4 text-left text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Select Image File *</label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border border-gray-200 rounded px-3 py-2 text-xs focus:border-gold cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
            >
              <option value="classroom">Classroom</option>
              <option value="labs">Labs</option>
              <option value="campus">Campus</option>
              <option value="events">Events</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Photo Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Advanced Food Tech Lab"
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
            />
          </div>

          <Button type="submit" isLoading={uploading} className="w-full mt-4 py-2.5">
            Start Upload
          </Button>
        </form>
      </Modal>

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </div>
  );
}
