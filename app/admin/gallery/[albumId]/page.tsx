'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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

export default function AdminAlbumDetailPage() {
  const params = useParams();
  const albumId = params?.albumId as string;

  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [loading, setLoading] = useState(true);

  // Upload Photo states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Edit Caption states
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [editCaptionText, setEditCaptionText] = useState('');
  const [savingCaption, setSavingCaption] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!albumId) return;
    let ignore = false;
    fetch(`/api/gallery/${albumId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && !data.error) {
          setAlbum(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [albumId, refreshTrigger]);

  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !photoUrl) {
      setToastMsg('Please select a file or enter a photo URL.');
      setToastType('error');
      return;
    }
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('imageUrl', photoUrl);
      }

      const res = await fetch(`/api/gallery/${albumId}/photos`, {
        method: 'POST',
        body: file ? formData : JSON.stringify({ imageUrl: photoUrl, caption }),
        headers: file ? {} : { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg('Photo uploaded and added successfully!');
        setToastType('success');
        setIsUploadOpen(false);
        setFile(null);
        setCaption('');
        setPhotoUrl('');
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setToastMsg(data.error || 'Failed to add photo.');
        setToastType('error');
      }
    } catch (err) {
      console.error(err);
      setToastMsg('Failed to connect to the server.');
      setToastType('error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to permanently delete this photo?')) return;

    try {
      const res = await fetch(`/api/gallery/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setToastMsg('Photo deleted successfully!');
        setToastType('success');
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setToastMsg('Failed to delete photo.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    }
  };

  const handleOpenEditCaption = (photo: PhotoItem) => {
    setEditingPhoto(photo);
    setEditCaptionText(photo.caption || '');
  };

  const handleSaveCaption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    setSavingCaption(true);

    try {
      const res = await fetch(`/api/gallery/photos/${editingPhoto.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: editCaptionText })
      });

      if (res.ok) {
        setToastMsg('Caption updated successfully!');
        setToastType('success');
        setEditingPhoto(null);
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setToastMsg('Failed to update caption.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    } finally {
      setSavingCaption(false);
    }
  };

  const handleMovePhoto = async (index: number, direction: 'up' | 'down') => {
    if (!album) return;
    const list = [...album.photos];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= list.length) return;

    const currentPhoto = list[index];
    const targetPhoto = list[targetIndex];

    try {
      // Swap order numbers
      const tempOrder = currentPhoto.order;
      currentPhoto.order = targetPhoto.order;
      targetPhoto.order = tempOrder;

      // Optimistic updates
      setAlbum({ ...album, photos: list.sort((a, b) => a.order - b.order) });

      // Save to server
      await Promise.all([
        fetch(`/api/gallery/photos/${currentPhoto.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: currentPhoto.order })
        }),
        fetch(`/api/gallery/photos/${targetPhoto.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: targetPhoto.order })
        })
      ]);

      setToastMsg('Photos reordered successfully!');
      setToastType('success');
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setToastMsg('Failed to save order change.');
      setToastType('error');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex flex-col gap-1 items-start">
          <Link href="/admin/gallery" className="text-xs text-gray-500 hover:text-gold transition-colors font-semibold">
            ← Back to Albums
          </Link>
          <h1 className="text-2xl font-serif font-bold text-navy mt-2">
            {loading ? 'Loading Album...' : album?.title}
          </h1>
          <p className="text-xs text-gray-500">{album?.description || 'Manage images in this collection.'}</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="text-xs py-2.5 px-4" disabled={loading}>
          + Add Photo
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : album && album.photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {album.photos.map((photo, index) => (
            <Card
              key={photo.id}
              className="p-0 overflow-hidden relative group hover:shadow-md transition-shadow border border-gray-200 bg-white flex flex-col justify-between"
              hoverable={false}
            >
              <div className="relative h-48 bg-gray-50 border-b border-gray-100 overflow-hidden">
                <img src={photo.imageUrl} alt={photo.caption || album.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    disabled={index === 0}
                    onClick={() => handleMovePhoto(index, 'up')}
                    className="w-6 h-6 bg-navy text-white text-[11px] font-bold rounded flex items-center justify-center cursor-pointer hover:bg-navy-light disabled:opacity-40"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    disabled={index === album.photos.length - 1}
                    onClick={() => handleMovePhoto(index, 'down')}
                    className="w-6 h-6 bg-navy text-white text-[11px] font-bold rounded flex items-center justify-center cursor-pointer hover:bg-navy-light disabled:opacity-40"
                    title="Move Down"
                  >
                    ▼
                  </button>
                </div>
              </div>

              <div className="p-4 flex-grow flex flex-col justify-between">
                <p className="text-xs text-gray-700 italic min-h-[36px] line-clamp-2">
                  {photo.caption || <span className="text-gray-400">No caption provided</span>}
                </p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-55">
                  <button
                    onClick={() => handleOpenEditCaption(photo)}
                    className="text-navy hover:text-gold text-[10px] font-bold cursor-pointer"
                  >
                    Edit Caption
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="text-red-600 hover:text-red-800 text-[10px] font-bold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-gray-500 text-sm bg-white border border-gray-200 rounded-2xl shadow-sm">
          No photos found inside this album. Click &quot;+ Add Photo&quot; to start uploading.
        </div>
      )}

      {/* Upload Photo Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Add Photo to Album">
        <form onSubmit={handleUploadPhoto} className="flex flex-col gap-4 text-left text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Select Image File</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border border-gray-200 rounded px-3 py-2 text-xs focus:border-gold cursor-pointer"
            />
            <p className="text-[10px] text-gray-400 mt-0.5">Or enter a direct photo URL below.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Photo Image URL</label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              disabled={!!file}
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Photo Caption</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Students in Network Engineering Lab"
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
            />
          </div>

          <Button type="submit" isLoading={uploading} className="w-full mt-4 py-2.5">
            Add Photo
          </Button>
        </form>
      </Modal>

      {/* Edit Caption Modal */}
      <Modal
        isOpen={editingPhoto !== null}
        onClose={() => setEditingPhoto(null)}
        title="Edit Photo Caption"
      >
        <form onSubmit={handleSaveCaption} className="flex flex-col gap-4 text-left text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Caption Text</label>
            <input
              type="text"
              required
              value={editCaptionText}
              onChange={(e) => setEditCaptionText(e.target.value)}
              placeholder="Enter photo caption..."
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
            />
          </div>

          <Button type="submit" isLoading={savingCaption} className="w-full mt-4 py-2.5">
            Save Caption
          </Button>
        </form>
      </Modal>

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </div>
  );
}
