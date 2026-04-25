'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, User, LayoutDashboard, Feather } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      style={{
        background: '#FAFAFA',
        borderBottom: '1px solid #1A1A1A',
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] text-white"
            >
              <Feather size={16} strokeWidth={2.5} />
            </div>
            <span
              className="font-display text-2xl tracking-wide text-[#1A1A1A]"
            >
              The Archive
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="link-underline text-sm font-light tracking-widest uppercase"
              style={{ color: 'var(--cream-dim)' }}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="link-underline text-sm font-light tracking-widest uppercase"
              style={{ color: 'var(--cream-dim)' }}
            >
              Stories
            </Link>

            {/* Divider */}
            <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />

            {user ? (
              <div className="flex items-center gap-5">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-light tracking-wider uppercase link-underline"
                  style={{ color: 'var(--cream-dim)' }}
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>

                <div
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 border border-[#1A1A1A] bg-white"
                >
                  <div
                    className="w-6 h-6 flex items-center justify-center text-xs bg-[#1A1A1A] text-white font-bold"
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium" style={{ color: 'var(--cream)' }}>
                    {user.username}
                  </span>
                  <button
                    onClick={logout}
                    className="ml-1 p-1 rounded-full transition-colors"
                    style={{ color: 'var(--cream-dim)' }}
                    title="Logout"
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--cream-dim)')}
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold tracking-widest uppercase text-[#474747] hover:text-[#1A1A1A] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-6 py-2.5 text-xs font-bold tracking-widest uppercase bg-[#1A1A1A] text-white hover:bg-[#474747] transition-colors"
                >
                  Start Writing
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            style={{ color: 'var(--cream-dim)' }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="md:hidden px-6 pb-6 pt-2 space-y-1"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {[
            { href: '/', label: 'Home' },
            { href: '/blog', label: 'Stories' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="block py-3 text-sm tracking-widest uppercase"
              style={{ color: 'var(--cream-dim)', borderBottom: '1px solid var(--border)' }}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-sm tracking-widest uppercase"
                style={{ color: 'var(--cream-dim)', borderBottom: '1px solid var(--border)' }}
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="block py-3 text-sm tracking-widest uppercase"
                style={{ color: 'var(--red)' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-sm tracking-widest uppercase"
                style={{ color: 'var(--cream-dim)', borderBottom: '1px solid var(--border)' }}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-sm tracking-widest uppercase"
                style={{ color: 'var(--gold)' }}
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
