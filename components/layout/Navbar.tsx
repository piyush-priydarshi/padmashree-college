'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSubmenu = (menu: string) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  return (
    <>
      <header className={`sticky top-0 z-[1000] w-full h-[70px] bg-white/95 backdrop-blur-[20px] border-b border-gray-200 flex items-center transition-all duration-300 ${
        scrolled ? 'shadow-sm' : ''
      }`}>
        <div className="container flex justify-between items-center w-full px-6 mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center text-gold font-serif text-2xl font-bold">
              P
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-navy leading-none">Padmashree College</span>
              <span className="text-[11px] text-gray-600 font-medium">Tinkune, Kathmandu</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 h-full">
            <Link href="/" className="text-sm font-medium text-gray-800 hover:text-gold transition-colors">Home</Link>
            
            <div className="relative group flex items-center h-full cursor-pointer">
              <span className="text-sm font-medium text-gray-800 hover:text-gold transition-colors">About Us</span>
              <div className="absolute top-[100%] left-1/2 -translate-x-1/2 translate-y-2 bg-white border border-gray-200 rounded-xl shadow-xl py-3 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
                <Link href="/about#intro" className="block px-6 py-2.5 text-[13px] font-medium text-gray-800 hover:bg-gray-50 hover:text-gold transition-all duration-200">Introduction</Link>
                <Link href="/about#chairperson" className="block px-6 py-2.5 text-[13px] font-medium text-gray-800 hover:bg-gray-50 hover:text-gold transition-all duration-200">Chairperson Message</Link>
                <Link href="/about#advisors" className="block px-6 py-2.5 text-[13px] font-medium text-gray-800 hover:bg-gray-50 hover:text-gold transition-all duration-200">Board of Advisors</Link>
                <Link href="/about#vision" className="block px-6 py-2.5 text-[13px] font-medium text-gray-800 hover:bg-gray-50 hover:text-gold transition-all duration-200">Mission & Vision</Link>
              </div>
            </div>

            <div className="relative group flex items-center h-full cursor-pointer">
              <span className="text-sm font-medium text-gray-800 hover:text-gold transition-colors">Our Programs</span>
              <div className="absolute top-[100%] left-1/2 -translate-x-1/2 translate-y-2 bg-white border border-gray-200 rounded-xl shadow-xl py-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
                <Link href="/programs/bit-bachelor-of-information-technology" className="block px-6 py-2.5 text-[13px] font-medium text-gray-800 hover:bg-gray-50 hover:text-gold transition-all duration-200">BIT (Information Tech)</Link>
                <Link href="/programs/bhm-bachelor-of-hotel-management" className="block px-6 py-2.5 text-[13px] font-medium text-gray-800 hover:bg-gray-50 hover:text-gold transition-all duration-200">BHM (Hospitality Mgmt)</Link>
                <Link href="/programs/bba-bachelor-of-business-administration" className="block px-6 py-2.5 text-[13px] font-medium text-gray-800 hover:bg-gray-50 hover:text-gold transition-all duration-200">BBA (Business Admin)</Link>
                <Link href="/programs/bca-bachelor-of-computer-applications" className="block px-6 py-2.5 text-[13px] font-medium text-gray-800 hover:bg-gray-50 hover:text-gold transition-all duration-200">BCA (Computer App)</Link>
                <Link href="/programs/btech-food-technology" className="block px-6 py-2.5 text-[13px] font-medium text-gray-800 hover:bg-gray-50 hover:text-gold transition-all duration-200">B.Tech Food (Food Tech)</Link>
              </div>
            </div>

            <Link href="/about" className="text-sm font-medium text-gray-800 hover:text-gold transition-colors">Student Life</Link>
            <Link href="/gallery" className="text-sm font-medium text-gray-800 hover:text-gold transition-colors">Gallery</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-800 hover:text-gold transition-colors">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center">
            <Link href="/apply" className="bg-gold text-navy font-semibold px-5 py-2.5 rounded-md text-[13px] shadow-md hover:bg-gold-light hover:shadow-lg transition-all duration-300 animate-glow-pulse">
              Apply Now →
            </Link>
          </div>

          <button onClick={() => setMobileOpen(true)} className="md:hidden flex flex-col gap-1.5 cursor-pointer">
            <span className="w-6 h-0.5 bg-navy rounded-sm"></span>
            <span className="w-6 h-0.5 bg-navy rounded-sm"></span>
            <span className="w-6 h-0.5 bg-navy rounded-sm"></span>
          </button>
        </div>
      </header>

      <div className={`fixed inset-0 w-full h-screen bg-navy z-[2000] p-10 flex flex-col justify-between transition-all duration-300 md:hidden overflow-y-auto ${
        mobileOpen ? 'right-0' : 'right-[-100%]'
      }`}>
        <div>
          <div className="flex justify-between items-center border-b border-white/10 pb-5">
            <div className="font-serif text-2xl font-bold text-white">Padmashree Menu</div>
            <button onClick={() => setMobileOpen(false)} className="text-3xl text-white cursor-pointer font-bold">&times;</button>
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <Link href="/" onClick={() => setMobileOpen(false)} className="text-xl font-bold text-white hover:text-gold transition-colors font-serif">Home</Link>
            
            <div className="flex flex-col">
              <div onClick={() => toggleSubmenu('about')} className="text-xl font-bold text-white hover:text-gold transition-colors font-serif flex justify-between items-center cursor-pointer">
                About Us <span>{activeSubmenu === 'about' ? '−' : '+'}</span>
              </div>
              <div className={`flex flex-col gap-2 pl-5 border-l border-white/15 overflow-hidden transition-all duration-300 ${
                activeSubmenu === 'about' ? 'max-h-56 mt-3 mb-2' : 'max-h-0'
              }`}>
                <Link href="/about#intro" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400 hover:text-gold">Introduction</Link>
                <Link href="/about#chairperson" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400 hover:text-gold">Chairperson Message</Link>
                <Link href="/about#advisors" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400 hover:text-gold">Board of Advisors</Link>
                <Link href="/about#vision" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400 hover:text-gold">Mission & Vision</Link>
              </div>
            </div>

            <div className="flex flex-col">
              <div onClick={() => toggleSubmenu('programs')} className="text-xl font-bold text-white hover:text-gold transition-colors font-serif flex justify-between items-center cursor-pointer">
                Our Programs <span>{activeSubmenu === 'programs' ? '−' : '+'}</span>
              </div>
              <div className={`flex flex-col gap-2 pl-5 border-l border-white/15 overflow-hidden transition-all duration-300 ${
                activeSubmenu === 'programs' ? 'max-h-72 mt-3 mb-2' : 'max-h-0'
              }`}>
                <Link href="/programs/bit-bachelor-of-information-technology" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400 hover:text-gold">BIT (Information Technology)</Link>
                <Link href="/programs/bhm-bachelor-of-hotel-management" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400 hover:text-gold">BHM (Hospitality Management)</Link>
                <Link href="/programs/bba-bachelor-of-business-administration" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400 hover:text-gold">BBA (Business Administration)</Link>
                <Link href="/programs/bca-bachelor-of-computer-applications" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400 hover:text-gold">BCA (Computer Applications)</Link>
                <Link href="/programs/btech-food-technology" onClick={() => setMobileOpen(false)} className="text-sm text-gray-400 hover:text-gold">B.Tech (Food Technology)</Link>
              </div>
            </div>

            <Link href="/about" onClick={() => setMobileOpen(false)} className="text-xl font-bold text-white hover:text-gold transition-colors font-serif">Student Life</Link>
            <Link href="/gallery" onClick={() => setMobileOpen(false)} className="text-xl font-bold text-white hover:text-gold transition-colors font-serif">Gallery</Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-xl font-bold text-white hover:text-gold transition-colors font-serif">Contact</Link>
          </div>
        </div>
        <div className="border-t border-white/10 pt-5 mt-auto flex flex-col gap-4">
          <Link href="/apply" onClick={() => setMobileOpen(false)} className="bg-gold text-navy text-center font-semibold py-3.5 rounded-md animate-glow-pulse block shadow-md">
            Apply Now →
          </Link>
        </div>
      </div>
    </>
  );
}
