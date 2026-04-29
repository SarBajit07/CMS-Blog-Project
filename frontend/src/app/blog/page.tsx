'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  published_at: string;
  categories?: Category[];
}

export default function BlogArchivePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, catsRes] = await Promise.all([
          apiFetch('/posts'),
          apiFetch('/categories')
        ]);

        if (postsRes.success) {
          setPosts(postsRes.data.posts);
        } else {
          setError(postsRes.message || 'Failed to load archive');
        }

        if (catsRes.success) {
          setCategories(catsRes.data.categories);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'DRAFT';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
                           post.categories?.some(cat => cat.slug === selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
      <main className="max-w-6xl mx-auto px-6 py-20">
        
        {/* Header */}
        <header className="mb-16 border-b border-[#1A1A1A] pb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-12 hover:text-[#777777] transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <h1 className="font-display text-5xl md:text-6xl mb-6">The Full Archive.</h1>
          <p className="text-lg text-[#474747] font-light max-w-2xl">
            A comprehensive record of all published editorial pieces, stories, and intellectual explorations.
          </p>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#777777]">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="SEARCH THE ARCHIVE..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#1A1A1A] text-xs font-bold tracking-widest uppercase outline-none focus:ring-1 focus:ring-[#1A1A1A] transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all ${!selectedCategory ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-transparent text-[#777777] border-[#E5E5E5] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'}`}
            >
              All Editions
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all ${selectedCategory === cat.slug ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-transparent text-[#777777] border-[#E5E5E5] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 border border-[#1A1A1A] bg-white">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-xs tracking-widest uppercase font-bold">Scanning the indexes...</p>
          </div>
        ) : error ? (
          <div className="p-12 border border-[#1A1A1A] bg-white text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-24 border border-[#1A1A1A] bg-white text-center">
            <p className="text-[#474747] italic">No records found matching your selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {filteredPosts.map((post) => (
              <article key={post.id} className="group border-b border-[#E5E5E5] pb-12 last:border-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-[10px] font-mono text-[#777777]">{formatDate(post.published_at)}</span>
                      {post.categories && post.categories.length > 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                          {post.categories[0].name}
                        </span>
                      )}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-display text-3xl md:text-4xl mb-4 group-hover:underline decoration-1 underline-offset-8 transition-all">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-[#474747] font-light max-w-3xl leading-relaxed">
                      {post.excerpt || "No excerpt available for this edition."}
                    </p>
                  </div>
                  <div className="md:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777] block mb-1">Author</span>
                    <span className="text-xs font-bold uppercase tracking-widest">{post.author_name}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
