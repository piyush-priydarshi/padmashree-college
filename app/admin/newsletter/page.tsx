'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Toast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Newsletter Form State
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetch('/api/newsletter/send')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && !data.error) {
          setSubscribers(data || []);
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

  const handleToggleActive = async (sub: Subscriber) => {
    try {
      const res = await fetch(`/api/newsletter/subscribe/${sub.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !sub.active }),
      });
      if (res.ok) {
        setToastMsg(`Subscriber ${sub.active ? 'deactivated' : 'activated'} successfully!`);
        setToastType('success');
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setToastMsg('Failed to update status.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this subscriber?')) return;

    try {
      const res = await fetch(`/api/newsletter/subscribe/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setToastMsg('Subscriber removed successfully!');
        setToastType('success');
        setRefreshTrigger((prev) => prev + 1);
      } else {
        setToastMsg('Failed to remove subscriber.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Network error.');
      setToastType('error');
    }
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      setToastMsg('Please fill in both the subject and the message.');
      setToastType('error');
      return;
    }

    const activeCount = subscribers.filter(s => s.active).length;
    if (activeCount === 0) {
      setToastMsg('No active subscribers to send the newsletter to.');
      setToastType('error');
      return;
    }

    if (!confirm(`Are you sure you want to broadcast this email to all ${activeCount} active subscriber(s)?`)) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg(`Newsletter dispatched successfully! Sent: ${data.successCount}, Failed: ${data.failCount}`);
        setToastType('success');
        setSubject('');
        setMessage('');
        setIsComposerOpen(false);
      } else {
        setToastMsg(data.error || 'Failed to dispatch newsletter.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Failed to broadcast email.');
      setToastType('error');
    } finally {
      setIsSending(false);
    }
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSubscribersCount = subscribers.filter(s => s.active).length;

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-navy">Newsletter & Subscribers</h1>
          <p className="text-xs text-gray-500 mt-1">Manage newsletter subscriptions and broadcast announcement updates.</p>
        </div>
        <Button onClick={() => setIsComposerOpen(true)} className="text-xs py-2.5 px-4">
          ✉️ Compose Newsletter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-left" hoverable={false}>
          <span className="text-xs font-semibold text-gray-500 block mb-1">Total Subscribers</span>
          <span className="text-3xl font-bold text-navy">{subscribers.length}</span>
        </Card>
        <Card className="p-6 text-left" hoverable={false}>
          <span className="text-xs font-semibold text-gray-500 block mb-1">Active Subscribers</span>
          <span className="text-3xl font-bold text-green-700">{activeSubscribersCount}</span>
        </Card>
        <Card className="p-6 text-left" hoverable={false}>
          <span className="text-xs font-semibold text-gray-500 block mb-1">Inactive Subscribers</span>
          <span className="text-3xl font-bold text-gray-500">{subscribers.length - activeSubscribersCount}</span>
        </Card>
      </div>

      <div className="flex justify-between items-center gap-4 flex-wrap mt-2">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search email subscribers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 focus:border-gold rounded-lg pl-3 pr-10 py-2.5 text-xs transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card className="p-0 overflow-hidden" hoverable={false}>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-[11px]">
                  <th className="p-4 font-semibold">Subscriber Email</th>
                  <th className="p-4 font-semibold">Joined Date</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                      <td className="p-4 font-semibold text-navy">{sub.email}</td>
                      <td className="p-4 text-gray-500">
                        {new Date(sub.subscribedAt).toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleActive(sub)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            sub.active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {sub.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2.5">
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className="text-red-600 hover:text-red-800 font-bold cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      No subscribers found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Newsletter Composer Modal */}
      <Modal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        title="Broadcast Newsletter"
      >
        <form onSubmit={handleSendNewsletter} className="flex flex-col gap-4 text-left text-xs">
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-[11px] text-yellow-800 leading-relaxed">
            ⚠️ <strong>Notice:</strong> This email will be sent to <strong>{activeSubscribersCount}</strong> active newsletter subscriber(s). Please double check details before sending.
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Email Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Padmashree Admissions Open - Fall Semester 2026"
              className="border border-gray-200 focus:border-gold rounded px-3 py-2.5 text-xs transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Message Content * (Markdown/HTML supported)</label>
            <textarea
              rows={8}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your newsletter message here. HTML tags are supported..."
              className="border border-gray-200 focus:border-gold rounded px-3 py-2.5 text-xs transition-colors resize-none leading-relaxed"
            />
          </div>

          <Button type="submit" isLoading={isSending} className="w-full mt-4 py-2.5">
            🚀 Broadcast to {activeSubscribersCount} Subscriber(s)
          </Button>
        </form>
      </Modal>

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </div>
  );
}
