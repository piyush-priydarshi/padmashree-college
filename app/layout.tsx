import React from 'react';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Padmashree College | BIT · BCA · BBA · BHM · B.Tech',
  description: 'Padmashree College Tinkune offers BIT, BBA, BHM, BCA and B.Tech Food. Admission open 2083. No entrance exam for BIT.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen bg-white flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
