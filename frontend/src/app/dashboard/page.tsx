'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { Loader2, Plus, Edit3, Trash2, Clock, CheckCircle } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  created_at: string;
}

function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const response = await apiFetch('/posts/me');
        if (response.success) {
          setPosts(response.data.posts);
        } else {
          setError(response.message || 'Failed to load your stories');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();
  };

  const publishedCount = posts.filter(p => p.status === 'published').length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Header Section */}
        <header className="mb-16 border-b border-[#1A1A1A] pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#777777] mb-4 block">
              Editorial Desk
            </span>
            <h1 className="font-display text-5xl md:text-6xl tracking-tight">
              Welcome, {user?.username}.
            </h1>
          </div>
          <Link 
            href="/dashboard/posts/new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#474747] transition-colors whitespace-nowrap"
          >
            <Plus size={14} /> Compose New
          </Link>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-l border-[#1A1A1A] mb-16">
          <div className="p-6 border-r border-b border-[#1A1A1A] bg-white">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777] block mb-2">Total Stories</span>
            <span className="font-display text-4xl">{posts.length}</span>
          </div>
          <div className="p-6 border-r border-b border-[#1A1A1A] bg-white">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777] block mb-2">Published</span>
            <span className="font-display text-4xl">{publishedCount}</span>
          </div>
          <div className="p-6 border-r border-b border-[#1A1A1A] bg-white">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777] block mb-2">Drafts</span>
            <span className="font-display text-4xl">{draftCount}</span>
          </div>
          <div className="p-6 border-r border-b border-[#1A1A1A] bg-white">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777] block mb-2">Role</span>
            <span className="font-display text-2xl uppercase tracking-widest mt-2 block">{user?.role}</span>
          </div>
        </div>

        {/* Posts List Section */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-[#E5E5E5] pb-4">
            <h2 className="font-display text-3xl">Your Editions</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-[#E5E5E5]">
              <Loader2 className="animate-spin mb-4 text-[#1A1A1A]" size={24} />
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777]">Retrieving Records</p>
            </div>
          ) : error ? (
            <div className="p-8 border border-[#E05555] bg-[#FEF2F2] text-[#E05555]">
              <p className="text-sm">{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-24 bg-white border border-[#E5E5E5] text-center">
              <p className="text-[#777777] font-light italic mb-6">Your desk is clear. You have not composed any stories yet.</p>
              <Link 
                href="/dashboard/posts/new"
                className="text-xs font-bold tracking-widest uppercase border-b border-[#1A1A1A] pb-1 hover:text-[#777777] transition-colors"
              >
                Start Writing
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-[#1A1A1A]">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-[#1A1A1A] bg-[#F9FAFB] text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777]">
                <div className="col-span-6">Headline</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Date Created</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-[#E5E5E5]">
                {posts.map((post) => (
                  <div key={post.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-[#F9FAFB] transition-colors group">
                    
                    <div className="col-span-1 md:col-span-6">
                      <h3 className="font-display text-xl mb-1 group-hover:underline decoration-1 underline-offset-4">
                        {post.status === 'published' ? (
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        ) : (
                          <span>{post.title}</span>
                        )}
                      </h3>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex items-center gap-2">
                      {post.status === 'published' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7] text-[10px] font-bold tracking-widest uppercase">
                          <CheckCircle size={10} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] text-[10px] font-bold tracking-widest uppercase">
                          <Clock size={10} /> Draft
                        </span>
                      )}
                    </div>

                    <div className="col-span-1 md:col-span-2 text-xs font-mono text-[#777777]">
                      {formatDate(post.created_at)}
                    </div>

                    <div className="col-span-1 md:col-span-2 flex items-center md:justify-end gap-4 mt-4 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs font-bold tracking-widest uppercase hover:text-[#777777] flex items-center gap-1">
                        <Edit3 size={14} /> Edit
                      </button>
                      <button className="text-xs font-bold tracking-widest uppercase text-[#E05555] hover:text-[#B91C1C] flex items-center gap-1">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
