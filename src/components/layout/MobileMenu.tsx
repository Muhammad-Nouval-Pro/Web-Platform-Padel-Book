'use client';

import { useState } from 'react';

/**
 * Super Safe Mobile Menu
 * Eliminating all framework-heavy components to debug the pushState error.
 */
export function MobileMenu({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Using standard <a> to bypass Next.js Link prefetching/history logic
  const NavItem = ({ href, label }: { href: string; label: string }) => (
    <a 
      href={href} 
      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 border border-gray-100"
    >
      <span className="text-sm font-bold text-gray-700">{label}</span>
      <span className="text-gray-300">→</span>
    </a>
  );

  return (
    <div className="lg:hidden">
      {/* Burger Toggle - Using div/span to avoid any button-related autofill/extension triggers */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center justify-center min-w-[50px]"
      >
        <div className="space-y-1.5">
          <span className={`block w-6 h-0.5 bg-indigo-600 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-indigo-600 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-indigo-600 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Simple semi-transparent backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 z-[1000] mt-20"
            onClick={() => setIsOpen(false)}
          />

          {/* Simple Dropdown Panel */}
          <div className="absolute top-full left-0 w-full bg-white shadow-2xl z-[1001] border-b border-gray-200">
            <div className="p-6 space-y-4 bg-white">
              
              {/* Profile Card */}
              {session && (
                <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg">
                  <p className="font-bold text-sm truncate">{session.name || 'User'}</p>
                  <p className="text-[10px] opacity-70 uppercase font-black uppercase tracking-widest">{session.role}</p>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex flex-col gap-2">
                <NavItem href="/" label="Sewa Lapangan" />
                <NavItem href="/bookings" label="Pesanan Saya" />
                <NavItem href="/open-matches" label="Mabar (Open Match)" />
                <NavItem href="/partner" label="Partner With Us" />
              </nav>

              {/* Simple Form Logout */}
              {session && (
                <div className="pt-4 border-t border-gray-100">
                  <form action="/api/auth/logout" method="POST">
                    <button 
                      type="submit"
                      className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm"
                    >
                      Logout Aplikasi
                    </button>
                  </form>
                </div>
              )}
              
              {!session && (
                <div className="grid grid-cols-2 gap-3">
                  <a href="/login" className="py-3 text-center border border-gray-100 rounded-xl text-xs font-bold text-gray-600">Masuk</a>
                  <a href="/register" className="py-3 text-center bg-indigo-600 text-white rounded-xl text-xs font-bold">Daftar</a>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
