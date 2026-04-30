'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PostSkeleton from '@/components/PostSkeleton';

import { toast } from 'sonner';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  published_at: string;
  status: string;
  cover_image_url?: string;
  categories?: { id: number; name: string; slug: string }[];
  tags?: { id: number; name: string; slug: string }[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [postsResponse, categoriesResponse] = await Promise.all([
        apiFetch('/posts', { params: { page: '1', limit: '10' } }),
        apiFetch('/categories')
      ]);
      
      if (postsResponse.success) {
        setPosts(postsResponse.data.posts);
        setHasMore(postsResponse.data.pagination.page < postsResponse.data.pagination.totalPages);
      } else {
        setError(postsResponse.message || 'Failed to fetch posts');
        toast.error(postsResponse.message || 'Failed to fetch posts');
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data.categories);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data');
      toast.error(err.message || 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const response = await apiFetch('/posts', { params: { page: nextPage.toString(), limit: '9' } });
      if (response.success) {
        setPosts([...posts, ...response.data.posts]);
        setPage(nextPage);
        setHasMore(response.data.pagination.page < response.data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Failed to load more posts', err);
      toast.error('Failed to load more records');
    } finally {
      setLoadingMore(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'DRAFT';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();
  };

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.categories?.some(cat => cat.slug === selectedCategory))
    : posts;

  const featuredPost = !selectedCategory && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const regularPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

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

      {/* ── Featured Post ───────────────────────────────────────────── */}
      {!loading && featuredPost && !selectedCategory && (
        <section className="max-w-6xl mx-auto px-6 lg:px-8 py-12 border-b border-[#1A1A1A]">
          <Link href={`/blog/${featuredPost.slug}`} className="group grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={featuredPost.cover_image_url ? "" : "bg-[#1A1A1A] aspect-[16/10] flex items-center justify-center p-12 order-2 md:order-1"}>
              {featuredPost.cover_image_url ? (
                <div className="aspect-[16/10] overflow-hidden border border-[#1A1A1A]">
                  <img 
                    src={featuredPost.cover_image_url} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="text-white text-center">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50 mb-4 block">Editorial Feature</span>
                  <h2 className="font-display text-4xl leading-tight italic">{featuredPost.title}</h2>
                </div>
              )}
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-2 py-1 bg-[#1A1A1A] text-white text-[9px] font-bold tracking-[0.2em] uppercase">
                  Featured Edition
                </span>
                <span className="text-[10px] font-mono text-[#777777]">{formatDate(featuredPost.published_at)}</span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl leading-tight mb-6 group-hover:underline decoration-1 underline-offset-8 transition-all">
                {featuredPost.title}
              </h2>
              <p className="text-[#474747] text-lg font-light leading-relaxed mb-8 line-clamp-3">
                {featuredPost.excerpt || (featuredPost.body ? featuredPost.body.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : '')}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-[#E5E5E5]">
                <span className="text-xs font-bold tracking-widest uppercase">By {featuredPost.author_name}</span>
                <span className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  Read Story <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Editorial Grid ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 border-b border-[#1A1A1A] pb-4 gap-4">
          <h2 className="font-display text-3xl">
            {selectedCategory ? `${categories.find(c => c.slug === selectedCategory)?.name} Editions` : 'Recent Archives'}
          </h2>
          
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`text-xs font-semibold tracking-wider uppercase whitespace-nowrap px-3 py-1 border transition-colors ${
                selectedCategory === null 
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                  : 'bg-transparent text-[#1A1A1A] border-transparent hover:border-[#1A1A1A]'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs font-semibold tracking-wider uppercase whitespace-nowrap px-3 py-1 border transition-colors ${
                  selectedCategory === cat.slug 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                    : 'bg-transparent text-[#1A1A1A] border-[#E5E5E5] hover:border-[#1A1A1A]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <Link href="/blog" className="text-sm font-semibold tracking-wider uppercase flex items-center gap-2 hover:text-[#474747] transition-colors whitespace-nowrap">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#1A1A1A]">
            {[...Array(6)].map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 border border-[#1A1A1A] bg-white text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs font-bold tracking-widest uppercase border-b border-[#1A1A1A]"
            >
              Retry Connection
            </button>
          </div>
        ) : regularPosts.length === 0 && !featuredPost ? (
          <div className="p-24 border border-[#1A1A1A] bg-white text-center">
            <h3 className="font-display text-3xl mb-4">No stories found.</h3>
            <p className="text-[#474747] font-light italic">There are no published articles in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-[#1A1A1A]">
            {regularPosts.map((post) => (
              <article 
                key={post.id} 
                className="p-8 border-r border-b border-[#1A1A1A] hover:bg-white transition-colors cursor-pointer group flex flex-col justify-between h-full min-h-[320px]"
              >
                <Link href={`/blog/${post.slug}`} className="contents">
                  <div>
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                      <span className="text-xs font-bold tracking-widest uppercase">
                        {post.categories && post.categories.length > 0 ? post.categories[0].name : 'STORY'}
                      </span>
                      <span className="text-[#777777] text-xs">—</span>
                      <span className="text-[#777777] text-xs font-mono">{formatDate(post.published_at)}</span>
                    </div>
                    <h3 className="font-display text-2xl leading-snug mb-4 group-hover:underline decoration-1 underline-offset-4">
                      {post.title}
                    </h3>
                    <p className="text-[#474747] text-sm leading-relaxed font-light">
                      {post.excerpt || (post.body ? post.body.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '')}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-4 border-t border-[#E5E5E5] text-xs font-semibold tracking-wide uppercase text-[#1A1A1A] flex justify-between items-center">
                    <span>By {post.author_name}</span>
                    {post.tags && post.tags.length > 0 && (
                      <span className="text-[#777777] font-normal hidden sm:inline-block truncate max-w-[120px]">
                        #{post.tags[0].name}
                      </span>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !selectedCategory && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-12 py-4 border border-[#1A1A1A] text-[#1A1A1A] text-xs font-bold tracking-widest uppercase hover:bg-[#1A1A1A] hover:text-white transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {loadingMore ? <Loader2 size={16} className="animate-spin" /> : null}
              {loadingMore ? 'Retrieving More Records' : 'Load More Editions'}
            </button>
          </div>
        )}
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
