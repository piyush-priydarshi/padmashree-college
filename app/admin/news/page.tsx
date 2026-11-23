'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: 'ANNOUNCEMENT' | 'EVENT';
  published: boolean;
  eventDate: string | null;
  createdAt: string;
}

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetch('/api/news?admin=true&limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && !data.error) {
          setNewsList(data.news || []);
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

  const handleTogglePublished = async (item: NewsItem) => {
    try {
      const res = await fetch(`/api/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      if (res.ok) {
        setToastMsg(`News ${item.published ? 'saved as draft' : 'published'} successfully!`);
        setToastType('success');
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setToastMsg('Failed to update publication status.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this news post?')) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('News post deleted successfully!');
        setToastType('success');
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setToastMsg('Failed to delete news post.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy">Manage News & Announcements</h1>
          <p className="text-xs text-gray-500 mt-1">Publish bulletins, notifications, and scheduled event articles.</p>
        </div>
        <Link
          href="/admin/news/new"
          className="bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm"
        >
          + Create News Post
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card className="p-0 overflow-hidden bg-white border border-gray-200" hoverable={false}>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-[11px]">
                  <th className="p-4 font-semibold">Post Title</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold">Event Date</th>
                  <th className="p-4 font-semibold">Date Created</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsList.length > 0 ? (
                  newsList.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                      <td className="p-4 font-semibold text-navy max-w-sm truncate">{item.title}</td>
                      <td className="p-4 font-medium text-gray-600">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          item.category === 'EVENT' ? 'bg-gold-pale text-gold' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleTogglePublished(item)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            item.published
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-250'
                          }`}
                        >
                          {item.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4 text-gray-650 font-medium">
                        {item.category === 'EVENT' && item.eventDate ? (
                          new Date(item.eventDate).toLocaleDateString()
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right flex justify-end gap-3.5">
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className="text-navy hover:text-gold font-bold transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-650 hover:text-red-800 font-bold cursor-pointer transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      No news posts found. Click &quot;+ Create News Post&quot; to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </div>
  );
}
