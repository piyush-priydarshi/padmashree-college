'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  imageUrl: string | null;
  published: boolean;
  createdAt: string;
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Academic',
    imageUrl: '',
    published: false,
  });

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);

  const loadNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news?admin=true');
      const data = await res.json();
      if (!data.error) {
        setNews(data.news || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Academic',
      imageUrl: '',
      published: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      imageUrl: item.imageUrl || '',
      published: item.published,
    });
    setIsModalOpen(true);
  };

  const handleTogglePublished = async (item: NewsItem) => {
    try {
      const res = await fetch(`/api/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      if (res.ok) {
        setToastMsg('Published status updated!');
        setToastType('success');
        loadNews();
      } else {
        setToastMsg('Failed to update published status.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('News deleted successfully!');
        setToastType('success');
        loadNews();
      } else {
        setToastMsg('Failed to delete news.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.content) {
      setToastMsg('Please fill in all required fields.');
      setToastType('error');
      return;
    }
    setSubmitting(true);

    try {
      const url = editingItem ? `/api/news/${editingItem.id}` : '/api/news';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg(editingItem ? 'News updated successfully!' : 'News created successfully!');
        setToastType('success');
        setIsModalOpen(false);
        loadNews();
      } else {
        setToastMsg(data.error || 'Failed to save news.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Failed to save news.');
      setToastType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy">Manage News Articles</h1>
          <p className="text-xs text-gray-500 mt-1">Write, edit, and publish newsletters and college notices.</p>
        </div>
        <Button onClick={handleOpenCreate} className="text-xs py-2.5 px-4">
          + Create News
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card className="p-0 overflow-hidden" hoverable={false}>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-[11px]">
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold text-center">Published</th>
                  <th className="p-4 font-semibold">Date Created</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.length > 0 ? (
                  news.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                      <td className="p-4 font-semibold text-navy max-w-xs truncate">{item.title}</td>
                      <td className="p-4 font-medium text-gray-600">{item.category}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleTogglePublished(item)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            item.published
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {item.published ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="text-navy hover:text-gold font-bold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      No news articles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit News Article' : 'Create News Article'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Article Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Admission Open 2083"
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
            >
              <option value="Academic">Academic</option>
              <option value="Research">Research</option>
              <option value="Admissions">Admissions</option>
              <option value="General">General</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Excerpt * (Short summary)</label>
            <input
              type="text"
              required
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A short summary of this article..."
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Content * (Article body)</label>
            <textarea
              rows={6}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write the full content body here..."
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Image URL (Optional)</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.cloudinary.com/..."
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="cursor-pointer h-4 w-4 text-gold border-gray-200 rounded"
            />
            <label htmlFor="published" className="font-semibold text-gray-700 cursor-pointer select-none">
              Publish immediately
            </label>
          </div>

          <Button type="submit" isLoading={submitting} className="w-full mt-4 py-2.5">
            {editingItem ? 'Save Changes' : 'Create Article'}
          </Button>
        </form>
      </Modal>

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </div>
  );
}
