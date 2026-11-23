'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
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

export default function AdminGalleryAlbumsPage() {
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<AlbumItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState('');

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && !data.error) {
          setAlbums(data || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [refreshTrigger]);

  const handleOpenCreate = () => {
    setEditingAlbum(null);
    setTitle('');
    setDescription('');
    setFile(null);
    setCoverUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (album: AlbumItem) => {
    setEditingAlbum(album);
    setTitle(album.title);
    setDescription(album.description || '');
    setFile(null);
    setCoverUrl(album.coverImage);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this album and all of its photos? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('Album deleted successfully!');
        setToastType('success');
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setToastMsg('Failed to delete album.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setToastMsg('Album title is required.');
      setToastType('error');
      return;
    }
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('coverImage', coverUrl);
      }

      const url = editingAlbum ? `/api/gallery/${editingAlbum.id}` : '/api/gallery';
      const method = editingAlbum ? 'PUT' : 'POST';

      // If editing and no new file was selected, we can just POST JSON instead of FormData
      let response;
      if (editingAlbum && !file) {
        response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, coverImage: coverUrl })
        });
      } else {
        response = await fetch(url, {
          method,
          body: formData
        });
      }

      const data = await response.json();
      if (response.ok) {
        setToastMsg(editingAlbum ? 'Album updated successfully!' : 'Album created successfully!');
        setToastType('success');
        setIsModalOpen(false);
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setToastMsg(data.error || 'Failed to save album.');
        setToastType('error');
      }
    } catch (err) {
      console.error(err);
      setToastMsg('Failed to connect to the server.');
      setToastType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy">Manage Photo Albums</h1>
          <p className="text-xs text-gray-500 mt-1">Create, edit, and organize nested photo collections.</p>
        </div>
        <Button onClick={handleOpenCreate} className="text-xs py-2.5 px-4">
          + Create Album
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : albums.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative h-44 bg-gray-100 overflow-hidden border-b border-gray-200">
                  <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 bg-navy/80 text-gold text-[9px] font-bold px-2 py-1 rounded-full">
                    🖼️ {album._count.photos} {album._count.photos === 1 ? 'Photo' : 'Photos'}
                  </span>
                </div>
                <div className="p-5 text-left">
                  <h3 className="font-serif text-base font-bold text-navy mb-1.5">{album.title}</h3>
                  {album.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{album.description}</p>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-100 mt-4 flex items-center justify-between gap-3">
                <Link
                  href={`/admin/gallery/${album.id}`}
                  className="bg-navy hover:bg-navy-light text-white text-[10px] font-bold px-3 py-1.5 rounded transition-colors"
                >
                  Manage Photos
                </Link>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(album)}
                    className="text-navy hover:text-gold text-[11px] font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(album.id, e)}
                    className="text-red-600 hover:text-red-800 text-[11px] font-bold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500 text-sm bg-white border border-gray-200 rounded-2xl shadow-sm">
          No photo albums found. Click &quot;+ Create Album&quot; to start.
        </div>
      )}

      {/* Create/Edit Album Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAlbum ? 'Edit Album Details' : 'Create Photo Album'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Album Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Graduation Ceremony 2026"
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief overview of this album..."
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Upload Cover Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border border-gray-200 rounded px-3 py-2 text-xs focus:border-gold cursor-pointer"
            />
            <p className="text-[10px] text-gray-400 mt-0.5">Or enter an image URL below if you already have one.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Cover Image URL</label>
            <input
              type="text"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              disabled={!!file}
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors disabled:opacity-50"
            />
          </div>

          <Button type="submit" isLoading={submitting} className="w-full mt-4 py-2.5">
            {editingAlbum ? 'Save Changes' : 'Create Album'}
          </Button>
        </form>
      </Modal>

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </div>
  );
}
