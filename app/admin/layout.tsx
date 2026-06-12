import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className="bg-gray-50 min-h-screen flex flex-col flex-grow">{children}</div>;
  }

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/news', label: 'News CRUD', icon: '📰' },
    { href: '/admin/events', label: 'Events CRUD', icon: '📅' },
    { href: '/admin/applications', label: 'Applications', icon: '🎓' },
    { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
    { href: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
    { href: '/admin/newsletter', label: 'Newsletter', icon: '✉️' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-grow text-gray-800 font-sans">
      <aside className="w-64 bg-navy text-white flex flex-col justify-between p-6 shrink-0 border-r border-white/5">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 bg-gold text-navy font-bold flex items-center justify-center rounded-md font-serif text-lg">
              P
            </div>
            <span className="font-bold text-sm tracking-wide">Padmashree Admin</span>
          </Link>
          <nav className="flex flex-col gap-1 text-left">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold hover:bg-white/10 transition-colors text-white"
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col gap-4 text-left">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-medium">Logged in as</span>
            <span className="text-xs font-bold text-white truncate">{session.user?.name}</span>
          </div>
          <Link
            href="/api/auth/signout"
            className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            🚪 Logout
          </Link>
        </div>
      </aside>

      <main className="flex-grow p-10 overflow-y-auto max-h-screen text-left">
        <div className="max-w-5xl mx-auto flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
