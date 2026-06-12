'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function AdminEditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'ANNOUNCEMENT' | 'EVENT'>('ANNOUNCEMENT');
  const [eventDate, setEventDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState('');
  const [published, setPublished] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        const data = await res.json();
        if (!data.error) {
          setTitle(data.title);
          setExcerpt(data.excerpt || '');
          setContent(data.content);
          setCategory(data.category);
          setCoverUrl(data.coverImage || '');
          setPublished(data.published);
          if (data.eventDate) {
            // Format to YYYY-MM-DDThh:mm
            const dateObj = new Date(data.eventDate);
            const offset = dateObj.getTimezoneOffset();
            const localDate = new Date(dateObj.getTime() - (offset*60*1000));
            setEventDate(localDate.toISOString().slice(0, 16));
          }
        } else {
          setToastMsg(data.error || 'Failed to load news notice.');
          setToastType('error');
        }
      } catch (err) {
        setToastMsg('Failed to load news notice.');
        setToastType('error');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setCoverUrl(data.url);
        setToastMsg('Cover image uploaded successfully!');
        setToastType('success');
      } else {
        setToastMsg(data.error || 'Failed to upload cover image.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Failed to connect to the upload server.');
      setToastType('error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (pubStatus: boolean) => {
    if (!title || !content) {
      setToastMsg('Title and content are required fields.');
      setToastType('error');
      return;
    }

    if (category === 'EVENT' && !eventDate) {
      setToastMsg('Event date is required for Event posts.');
      setToastType('error');
      return;
    }

    setSubmitting(true);

    try {
      const body = {
        title,
        excerpt: excerpt || null,
        content,
        category,
        coverImage: coverUrl || null,
        eventDate: category === 'EVENT' ? eventDate : null,
        published: pubStatus,
      };

      const res = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg(pubStatus ? 'News notice published successfully!' : 'Saved as Draft successfully!');
        setToastType('success');
        setTimeout(() => {
          router.push('/admin/news');
        }, 1500);
      } else {
        setToastMsg(data.error || 'Failed to update news notice.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network connection failed.');
      setToastType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-1 items-start">
        <Link href="/admin/news" className="text-xs text-gray-500 hover:text-gold transition-colors font-semibold">
          ← Back to News List
        </Link>
        <h1 className="text-2xl font-serif font-bold text-navy mt-2">Edit News Notice</h1>
        <p className="text-xs text-gray-500">Edit metadata, schedule event details, and update the notice body.</p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center bg-white border border-gray-200 rounded-2xl shadow-sm">
          <LoadingSpinner />
        </div>
      ) : (
        <Card className="p-6 bg-white border border-gray-200" hoverable={false}>
          <div className="flex flex-col gap-5">
            {/* Title input */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-gray-700">Article Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Padmashree BIT Convocation 2083"
                className="border border-gray-200 focus:border-gold rounded-lg px-4 py-2.5 text-xs transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              {/* Category dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as 'ANNOUNCEMENT' | 'EVENT')}
                  className="border border-gray-200 focus:border-gold rounded-lg px-4 py-2.5 text-xs transition-colors"
                >
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="EVENT">Event</option>
                </select>
              </div>

              {/* Event Date picker */}
              {category === 'EVENT' && (
                <div className="flex flex-col gap-1.5 animate-fadeInUp">
                  <label className="font-semibold text-gray-700">Event Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="border border-gray-200 focus:border-gold rounded-lg px-4 py-2 text-xs transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-gray-700">Excerpt (Short summary preview)</label>
              <input
                type="text"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A one-sentence overview displayed on the listings page..."
                className="border border-gray-200 focus:border-gold rounded-lg px-4 py-2.5 text-xs transition-colors"
              />
            </div>

            {/* Cover image uploader */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Upload New Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:border-gold cursor-pointer"
                />
                {uploadingImage && <span className="text-[10px] text-navy font-bold animate-pulse">Uploading image...</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-gray-700">Cover Image URL</label>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  disabled={uploadingImage}
                  className="border border-gray-200 focus:border-gold rounded-lg px-4 py-2.5 text-xs transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            {/* Preview Image display */}
            {coverUrl && (
              <div className="h-44 w-full md:w-80 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 self-start">
                <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Tiptap Editor */}
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-gray-700">Content / Body *</label>
              <RichTextEditor content={content} onChange={setContent} />
            </div>

            {/* Save buttons */}
            <div className="flex justify-end gap-3.5 border-t border-gray-100 pt-6 mt-4">
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => handleSave(false)}
                className="text-xs py-2 px-5"
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                disabled={submitting}
                onClick={() => handleSave(true)}
                className="text-xs py-2 px-5 bg-navy hover:bg-navy-light text-white"
              >
                {published ? 'Update & Publish' : 'Publish Post'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </div>
  );
}
