'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Toast } from '../ui/Toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setToastMsg('Thank you for subscribing to our newsletter!');
        setToastType('success');
        setEmail('');
      } else {
        setToastMsg(data.error || 'Failed to subscribe');
        setToastType('error');
      }
    } catch (err) {
      setToastMsg('Failed to connect to the server');
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <footer className="bg-[#050e1c] pt-20 pb-8 px-6 text-gray-400">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/8 pb-12">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-navy rounded flex items-center justify-center text-gold font-serif text-xl font-bold border border-white/5">
                P
              </div>
              <span className="text-lg font-bold text-white">Padmashree College</span>
            </div>
            <p className="text-[13px] leading-relaxed mb-6">
              Delivering career-centered education with advanced industry accreditations and state-of-the-art facilities in Tinkune, Kathmandu.
            </p>
            <div className="flex flex-col gap-3 mb-6 text-[13px]">
              <div className="flex items-center gap-2.5">
                <span>📍</span> Tinkune, Kathmandu, Nepal
              </div>
              <div className="flex items-center gap-2.5">
                <span>📞</span> +977 1-4112252 / 4112403
              </div>
              <div className="flex items-center gap-2.5">
                <span>✉️</span> info@padmashreecollege.edu.np
              </div>
            </div>
            <div className="flex gap-2">
              {['f', 'in', 'tw', 'yt', 'tk'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 bg-white/5 rounded flex items-center justify-center text-white text-sm font-bold hover:bg-gold hover:text-navy hover:-translate-y-0.5 transition-all duration-300"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-white font-bold text-base mb-6">Quick Links</h3>
            <div className="flex flex-col gap-3 text-[13px]">
              <Link href="/" className="hover:text-gold hover:translate-x-1 transition-all">Home</Link>
              <Link href="/about" className="hover:text-gold hover:translate-x-1 transition-all">About Us</Link>
              <Link href="/programs" className="hover:text-gold hover:translate-x-1 transition-all">Programs</Link>
              <Link href="/about" className="hover:text-gold hover:translate-x-1 transition-all">Student Life</Link>
              <Link href="/gallery" className="hover:text-gold hover:translate-x-1 transition-all">Gallery</Link>
              <Link href="/news" className="hover:text-gold hover:translate-x-1 transition-all">News</Link>
              <Link href="/contact" className="hover:text-gold hover:translate-x-1 transition-all">Contact</Link>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-white font-bold text-base mb-6">Our Programs</h3>
            <div className="flex flex-col gap-3 text-[13px]">
              <Link href="/programs/bit-bachelor-of-information-technology" className="hover:text-gold hover:translate-x-1 transition-all">BIT (Technology)</Link>
              <Link href="/programs/bhm-bachelor-of-hotel-management" className="hover:text-gold hover:translate-x-1 transition-all">BHM (Hospitality)</Link>
              <Link href="/programs/bba-bachelor-of-business-administration" className="hover:text-gold hover:translate-x-1 transition-all">BBA (Management)</Link>
              <Link href="/programs/bca-bachelor-of-computer-applications" className="hover:text-gold hover:translate-x-1 transition-all">BCA (Applications)</Link>
              <Link href="/programs/btech-food-technology" className="hover:text-gold hover:translate-x-1 transition-all">B.Tech (Food Science)</Link>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-white font-bold text-base mb-6">Newsletter</h3>
            <p className="text-[13px] mb-5">
              Subscribe to our newsletter to receive the latest updates, event schedules, and notices.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                className="w-full bg-white/5 border border-white/10 focus:border-gold focus:bg-white/10 rounded-md px-4 py-3 text-[13px] text-white transition-all duration-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gold text-navy font-semibold py-3 rounded-md hover:bg-gold-light transition-all duration-300 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center pt-8 text-[12px] gap-4">
          <span>© 2026 Padmashree College. All Rights Reserved.</span>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-gold">Privacy Policy</Link>
            <Link href="#" className="hover:text-gold">Terms & Conditions</Link>
            <Link href="#" className="hover:text-gold">Disclaimer</Link>
          </div>
        </div>
      </footer>

      {toastMsg && (
        <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg('')} />
      )}
    </>
  );
}
