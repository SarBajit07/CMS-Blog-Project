'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, LayoutDashboard, Feather, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAFA] border-b border-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 flex items-center justify-center bg-[#1A1A1A] text-white">
              <Feather size={18} strokeWidth={2.5} />
            </div>
            <span className="font-display text-2xl tracking-tight text-[#1A1A1A] hidden sm:inline">
              The Archive
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-10">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777] group-focus-within:text-[#1A1A1A] transition-colors" size={14} />
              <input
                type="text"
                placeholder="Search the archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-[#E5E5E5] focus:border-[#1A1A1A] px-10 py-2 text-[11px] font-bold tracking-widest uppercase outline-none transition-all"
              />
            </div>
          </form>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 shrink-0">
            <Link
              href="/blog"
              className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] hover:text-[#777777] transition-colors"
            >
              Stories
            </Link>

            {user ? (
              <div className="flex items-center gap-8">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] hover:text-[#777777] transition-colors"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>

                <div className="flex items-center gap-4 pl-4 border-l border-[#1A1A1A]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center text-[10px] bg-[#1A1A1A] text-white font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1 text-[#1A1A1A] hover:text-[#E05555] transition-colors"
                    title="Logout"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <Link
                  href="/auth/login"
                  className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1A1A] hover:text-[#777777] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-6 py-3 text-[11px] font-bold tracking-[0.2em] uppercase bg-[#1A1A1A] text-white hover:bg-[#474747] transition-colors"
                >
                  Start Writing
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-[#1A1A1A]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-[#1A1A1A] px-6 py-8 space-y-6 animate-fade-in">
          <Link
            href="/blog"
            onClick={() => setIsOpen(false)}
            className="block text-sm font-bold tracking-[0.2em] uppercase text-[#1A1A1A]"
          >
            Stories
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-sm font-bold tracking-[0.2em] uppercase text-[#1A1A1A]"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="block text-sm font-bold tracking-[0.2em] uppercase text-[#E05555]"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="block text-sm font-bold tracking-[0.2em] uppercase text-[#1A1A1A]"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsOpen(false)}
                className="block text-sm font-bold tracking-[0.2em] uppercase text-[#1A1A1A]"
              >
                Start Writing
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
