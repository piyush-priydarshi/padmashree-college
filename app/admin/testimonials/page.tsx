'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Testimonial {
  id: string;
  name: string;
  initials: string;
  program: string;
  quote: string;
  published: boolean;
  order: number;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    initials: '',
    program: '',
    quote: '',
    published: false,
    order: 0,
  });

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetch('/api/testimonials?admin=true')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && !data.error) {
          setTestimonials(data || []);
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
    setEditingItem(null);
    setFormData({
      name: '',
      initials: '',
      program: '',
      quote: '',
      published: false,
      order: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      initials: item.initials,
      program: item.program,
      quote: item.quote,
      published: item.published,
      order: item.order,
    });
    setIsModalOpen(true);
  };

  const handleTogglePublished = async (item: Testimonial) => {
    try {
      const res = await fetch(`/api/testimonials/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      if (res.ok) {
        setToastMsg('Published status updated!');
        setToastType('success');
        setRefreshTrigger((prev) => prev + 1);
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
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMsg('Testimonial deleted successfully!');
        setToastType('success');
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setToastMsg('Failed to delete testimonial.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.initials || !formData.program || !formData.quote) {
      setToastMsg('Please fill in all required fields.');
      setToastType('error');
      return;
    }
    setSubmitting(true);

    try {
      const url = editingItem ? `/api/testimonials/${editingItem.id}` : '/api/testimonials';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg(editingItem ? 'Testimonial updated successfully!' : 'Testimonial created successfully!');
        setToastType('success');
        setIsModalOpen(false);
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setToastMsg(data.error || 'Failed to save testimonial.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Failed to save testimonial.');
      setToastType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy">Manage Testimonials</h1>
          <p className="text-xs text-gray-500 mt-1">Add and moderate feedback and reviews from students and alumni.</p>
        </div>
        <Button onClick={handleOpenCreate} className="text-xs py-2.5 px-4">
          + Add Testimonial
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
                  <th className="p-4 font-semibold w-12 text-center">Initials</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Program / Role</th>
                  <th className="p-4 font-semibold">Quote</th>
                  <th className="p-4 font-semibold text-center">Sort Order</th>
                  <th className="p-4 font-semibold text-center">Published</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.length > 0 ? (
                  testimonials.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                      <td className="p-4 text-center">
                        <div className="w-8 h-8 rounded-full bg-navy/5 text-navy font-bold flex items-center justify-center text-[10px] uppercase">
                          {item.initials}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-navy">{item.name}</td>
                      <td className="p-4 font-medium text-gray-600">{item.program}</td>
                      <td className="p-4 text-gray-500 max-w-sm truncate">{item.quote}</td>
                      <td className="p-4 text-center font-medium text-gray-600">{item.order}</td>
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
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No testimonials found.
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
        title={editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Karki"
                className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-gray-700">Initials * (2-3 Letters)</label>
              <input
                type="text"
                required
                maxLength={3}
                value={formData.initials}
                onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                placeholder="e.g. RK"
                className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors uppercase"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Program / Affiliation *</label>
            <input
              type="text"
              required
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              placeholder="e.g. BIT Graduate / BCA Alumnus"
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Quote *</label>
            <textarea
              rows={4}
              required
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="Write the student's quote or testimonial here..."
              className="border border-gray-200 focus:border-gold rounded px-3 py-2 text-xs transition-colors resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Display Order (Sorting weight)</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
              placeholder="e.g. 0, 1, 2"
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
              Publish immediately on website
            </label>
          </div>

          <Button type="submit" isLoading={submitting} className="w-full mt-4 py-2.5">
            {editingItem ? 'Save Changes' : 'Create Testimonial'}
          </Button>
        </form>
      </Modal>

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </div>
  );
}
