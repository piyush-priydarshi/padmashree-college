'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string | null;
  eventDate: string;
  published: boolean;
  createdAt: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    imageUrl: '',
    eventDate: '',
    published: false,
  });

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events?admin=true');
      const data = await res.json();
      if (!data.error) {
        setEvents(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      category: 'Academic',
      imageUrl: '',
      eventDate: '',
      published: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: EventItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl || '',
      eventDate: new Date(item.eventDate).toISOString().slice(0, 16),
      published: item.published,
    });
    setIsModalOpen(true);
  };

  const handleTogglePublished = async (item: EventItem) => {
    try {
      const res = await fetch(`/api/events/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      if (res.ok) {
        setToastMsg('Published status updated!');
        setToastType('success');
        loadEvents();
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
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('Event deleted successfully!');
        setToastType('success');
        loadEvents();
      } else {
        setToastMsg('Failed to delete event.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.eventDate) {
      setToastMsg('Please fill in all required fields.');
      setToastType('error');
      return;
    }
    setSubmitting(true);

    try {
      const url = editingItem ? `/api/events/${editingItem.id}` : '/api/events';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg(editingItem ? 'Event updated successfully!' : 'Event created successfully!');
        setToastType('success');
        setIsModalOpen(false);
        loadEvents();
      } else {
        setToastMsg(data.error || 'Failed to save event.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Failed to save event.');
      setToastType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy">Manage Events</h1>
          <p className="text-xs text-gray-500 mt-1">Manage futsal meets, IT seminars, and student campaigns.</p>
        </div>
        <Button onClick={handleOpenCreate} className="text-xs py-2.5 px-4">
          + Add Event
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
                  <th className="p-4 font-semibold">Event Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                      <td className="p-4 font-semibold text-navy max-w-xs truncate">{item.title}</td>
                      <td className="p-4 font-medium text-gray-600 capitalize">{item.category}</td>
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
                        {new Date(item.eventDate).toLocaleDateString()}
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
                      No events found.
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
        title={editingItem ? 'Edit Event' : 'Add Event'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Event Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Annual Futsal Tournament"
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
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Community">Community</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Event Date *</label>
            <input
              type="datetime-local"
              required
              value={formData.eventDate}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Description *</label>
            <textarea
              rows={5}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide details about the event..."
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
            {editingItem ? 'Save Changes' : 'Create Event'}
          </Button>
        </form>
      </Modal>

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </div>
  );
}
