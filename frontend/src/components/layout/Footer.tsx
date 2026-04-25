import React from 'react';
import Link from 'next/link';
import { Feather } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Browse Stories', href: '/blog' },
    { label: 'Start Writing', href: '/auth/register' },
    { label: 'Categories', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-alt)' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <div
                className="w-8 h-8 flex items-center justify-center rounded"
                style={{ background: 'var(--gold)', color: 'var(--bg)' }}
              >
                <Feather size={16} strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl" style={{ color: 'var(--cream)' }}>
                Mini<span style={{ color: 'var(--gold)' }}>CMS</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--cream-dim)', maxWidth: '240px' }}>
              A space for deliberate writing. Built for creators who value substance over noise.
            </p>

            {/* Decorative horizontal rule with gold dot */}
            <div className="flex items-center gap-3 mt-8">
              <div style={{ height: '1px', width: '40px', background: 'var(--gold)' }} />
              <div style={{ width: '4px', height: '4px', background: 'var(--gold)', borderRadius: '50%' }} />
              <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3
                className="text-xs tracking-widest uppercase mb-5 font-medium"
                style={{ color: 'var(--gold)' }}
              >
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="link-underline text-sm font-light"
                      style={{ color: 'var(--cream-dim)' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: '#3A4A5E' }}>
            &copy; {new Date().getFullYear()} MiniCMS. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: '#3A4A5E' }}>
            Crafted with deliberate intent.
          </p>
        </div>
      </div>
    </footer>
  );
}
