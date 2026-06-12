'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setToastMsg('Please enter both email and password.');
      setToastType('error');
      return;
    }
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setToastMsg('Invalid email or password.');
        setToastType('error');
      } else {
        setToastMsg('Login successful!');
        setToastType('success');
        setTimeout(() => {
          router.push('/admin/dashboard');
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      setToastMsg('Failed to connect to authentication server.');
      setToastType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-navy min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_120%,rgba(245,166,35,0.06)_0%,transparent_60%)] flex-grow">
        <div className="w-full max-w-sm bg-navy-mid border border-white/8 p-8 md:p-10 rounded-2xl shadow-2xl relative z-10 text-left">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gold text-navy font-serif text-2xl font-bold rounded-xl flex items-center justify-center mx-auto mb-4">
              P
            </div>
            <h1 className="text-xl font-serif font-bold text-white leading-tight">Admin Portal</h1>
            <p className="text-xs text-gray-400 mt-1">Sign in with your admin credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@padmashreecollege.edu.np"
                className="bg-white/5 border border-white/10 focus:border-gold focus:bg-white/10 rounded-md px-4 py-2.5 text-xs text-white transition-all duration-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border border-white/10 focus:border-gold focus:bg-white/10 rounded-md px-4 py-2.5 text-xs text-white transition-all duration-300"
              />
            </div>

            <Button type="submit" isLoading={loading} className="w-full mt-4 text-xs py-3">
              Login to Portal
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
