'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setToastMsg('Please fill in all required fields.');
      setToastType('error');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMsg('Your message has been sent successfully!');
        setToastType('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setToastMsg(data.error || 'Failed to send message.');
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
      <section className="py-24 px-6 bg-off-white flex-grow">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-gold uppercase">Get In Touch</span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy mt-2">Contact Us</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      className="bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white rounded-md px-4 py-2.5 text-sm transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white rounded-md px-4 py-2.5 text-sm transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Your Phone"
                      className="bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white rounded-md px-4 py-2.5 text-sm transition-all duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-700">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Inquiry Subject"
                      className="bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white rounded-md px-4 py-2.5 text-sm transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">Message *</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="bg-gray-50 border border-gray-200 focus:border-gold focus:bg-white rounded-md px-4 py-2.5 text-sm transition-all duration-300 resize-none"
                  />
                </div>

                <Button type="submit" isLoading={loading} className="w-full mt-2">
                  Send Message
                </Button>
              </form>
            </div>

            <div className="flex flex-col gap-8">
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm flex flex-col gap-6">
                <h3 className="text-lg font-bold text-navy">Campus Directory</h3>
                <div className="flex flex-col gap-4 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📍</span>
                    <div>
                      <h4 className="font-bold text-navy">Address</h4>
                      <p>Tinkune, Kathmandu, Nepal</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">📞</span>
                    <div>
                      <h4 className="font-bold text-navy">Phone Numbers</h4>
                      <p>+977 1-4112252, 4112403</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl">✉️</span>
                    <div>
                      <h4 className="font-bold text-navy">Emails</h4>
                      <p>info@padmashreecollege.edu.np</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-64 bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.167389146199!2d85.34580211506148!3d27.6812269828036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m3!1d0!3d0!2zMjfCsDQwJzUyLjQiTiA4NcKwMjAnNTIuNyJFOQ!5e0!3m2!1sen!2snp!4v1620000000000!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </>
  );
}
