'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const featuredArticles = [
  {
    title: 'The Architecture of Silence',
    excerpt: 'Exploring the role of negative space in modern digital environments and how the absence of information creates clarity.',
    category: 'DESIGN',
    date: 'OCT 24, 2024',
    author: 'Elena Rostova'
  },
  {
    title: 'Cognitive Load in the Era of AI',
    excerpt: 'Why minimalist interfaces are no longer just an aesthetic choice, but a psychological necessity for focused work.',
    category: 'TECHNOLOGY',
    date: 'OCT 21, 2024',
    author: 'Marcus Vance'
  },
  {
    title: 'Return to the Broadsheet',
    excerpt: 'A historical analysis of print media layouts and their surprising relevance in creating trustworthy digital platforms.',
    category: 'EDITORIAL',
    date: 'OCT 18, 2024',
    author: 'Sarah Jenkins'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white">
      
      {/* ── Header / Hero ────────────────────────────────────────────── */}
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-32 pb-24 flex flex-col items-center text-center">
          <span className="text-xs font-semibold tracking-[0.15em] uppercase mb-6 text-[#474747]">
            The Digital Broadsheet
          </span>
          <h1 className="font-display text-6xl md:text-8xl leading-tight tracking-tight mb-8 max-w-4xl">
            The Intellectual Archive.
          </h1>
          <p className="text-lg md:text-xl text-[#474747] max-w-2xl leading-relaxed mb-12 font-light">
            A minimalist sanctuary for deep reading and focused writing. We reject the noise of modern interfaces in favor of pure, structural clarity.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-[#1A1A1A] text-white text-sm tracking-widest uppercase font-semibold hover:bg-[#474747] transition-colors rounded-none"
            >
              Start Writing
            </Link>
            <Link
              href="/blog"
              className="px-8 py-3 bg-transparent text-[#1A1A1A] border border-[#1A1A1A] text-sm tracking-widest uppercase font-semibold hover:bg-[#f0f0f0] transition-colors rounded-none"
            >
              Read Stories
            </Link>
          </div>
        </div>
      </header>

      {/* ── Editorial Grid ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex items-center justify-between mb-12 border-b border-[#1A1A1A] pb-4">
          <h2 className="font-display text-3xl">Latest Editions</h2>
          <Link href="/blog" className="text-sm font-semibold tracking-wider uppercase flex items-center gap-2 hover:text-[#474747] transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#1A1A1A]">
          {featuredArticles.map((article, index) => (
            <article 
              key={index} 
              className="p-8 border-r border-b border-[#1A1A1A] hover:bg-white transition-colors cursor-pointer group flex flex-col justify-between h-full min-h-[320px]"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-bold tracking-widest uppercase">{article.category}</span>
                  <span className="text-[#777777] text-xs">—</span>
                  <span className="text-[#777777] text-xs font-mono">{article.date}</span>
                </div>
                <h3 className="font-display text-2xl leading-snug mb-4 group-hover:underline decoration-1 underline-offset-4">
                  {article.title}
                </h3>
                <p className="text-[#474747] text-sm leading-relaxed font-light">
                  {article.excerpt}
                </p>
              </div>
              
              <div className="mt-8 pt-4 border-t border-[#E5E5E5] text-xs font-semibold tracking-wide uppercase text-[#1A1A1A]">
                By {article.author}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Manifesto Section ───────────────────────────────────────── */}
      <section className="border-t border-[#1A1A1A] bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-32 flex flex-col md:flex-row items-start justify-between gap-16">
          <h2 className="font-display text-4xl md:text-5xl leading-tight max-w-lg">
            We believe words deserve a better home.
          </h2>
          <div className="max-w-md">
            <p className="text-[#474747] leading-relaxed mb-8">
              In a landscape cluttered with notifications, rounded buttons, and endless infinite scrolls, we provide a structured, disciplined environment. Zero distractions. Zero artificial styling. Just you and your thoughts, set in ink.
            </p>
            <Link
              href="/about"
              className="text-sm font-bold tracking-widest uppercase flex items-center gap-2 pb-1 border-b border-[#1A1A1A] w-max hover:text-[#474747] hover:border-[#474747] transition-colors"
            >
              Read our manifesto <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
