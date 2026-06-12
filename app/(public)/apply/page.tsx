'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    program: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.program) {
      setToastMsg('Please fill in all required fields.');
      setToastType('error');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg('Your application was submitted successfully!');
        setToastType('success');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          program: '',
          message: '',
        });
      } else {
        setToastMsg(data.error || 'Failed to submit application.');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Failed to connect to the server.');
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-navy py-20 px-6 flex-grow flex items-center justify-center bg-[radial-gradient(circle_at_50%_120%,rgba(245,166,35,0.06)_0%,transparent_60%)]">
        <div className="w-full max-w-lg bg-navy-mid border border-white/8 p-8 md:p-10 rounded-2xl shadow-2xl relative z-10 my-8">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold tracking-widest text-gold uppercase">Admission 2083</span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-white mt-2">Apply Online</h1>
            <p className="text-xs text-gray-400 mt-2">Fill the form below to initiate your registration process.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                className="bg-white/5 border border-white/10 focus:border-gold focus:bg-white/10 rounded-md px-4 py-3 text-sm text-white transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="bg-white/5 border border-white/10 focus:border-gold focus:bg-white/10 rounded-md px-4 py-3 text-sm text-white transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+977 9800000000"
                className="bg-white/5 border border-white/10 focus:border-gold focus:bg-white/10 rounded-md px-4 py-3 text-sm text-white transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Target Program *</label>
              <select
                required
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="bg-white/5 border border-white/10 focus:border-gold focus:bg-white/10 rounded-md px-4 py-3 text-sm text-gray-300 transition-all duration-300"
              >
                <option value="" disabled className="bg-navy-mid text-gray-400">Select Program</option>
                <option value="BIT" className="bg-navy-mid text-white">BIT (Bachelor of Information Technology)</option>
                <option value="BHM" className="bg-navy-mid text-white">BHM (Bachelor of Hotel Management)</option>
                <option value="BBA" className="bg-navy-mid text-white">BBA (Bachelor of Business Administration)</option>
                <option value="BCA" className="bg-navy-mid text-white">BCA (Bachelor of Computer Applications)</option>
                <option value="BTECH" className="bg-navy-mid text-white">B.Tech Food (Food Technology)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Additional Message (Optional)</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention any queries or comments..."
                className="bg-white/5 border border-white/10 focus:border-gold focus:bg-white/10 rounded-md px-4 py-3 text-sm text-white transition-all duration-300 resize-none"
              />
            </div>

            <Button type="submit" isLoading={loading} className="w-full mt-2">
              Submit Application
            </Button>
          </form>
        </div>
      </section>

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </>
  );
}
