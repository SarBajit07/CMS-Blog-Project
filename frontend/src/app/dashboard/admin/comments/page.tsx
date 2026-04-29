'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Trash2, Check, X, Eye } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

interface Comment {
  id: number;
  body: string;
  author_name: string;
  post_title: string;
  created_at: string;
  is_approved: boolean;
}

function CommentsManagementPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/comments');
      if (response.success) {
        setComments(response.data.comments || []);
      } else {
        setError(response.message || 'Failed to load comments');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id: number, currentStatus: boolean) => {
    try {
      const response = await apiFetch(`/comments/${id}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      if (response.success) {
        setComments(comments.map(c => c.id === id ? { ...c, is_approved: !currentStatus } : c));
      } else {
        alert(response.message || 'Failed to update status');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure? This will permanently delete the comment.")) return;
    try {
      const response = await apiFetch(`/comments/${id}`, {
        method: 'DELETE',
      });
      if (response.success) {
        setComments(comments.filter(c => c.id !== id));
      } else {
        alert(response.message || 'Failed to delete comment');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-4xl mb-4">Unauthorized Access</h1>
          <p className="text-[#474747] mb-8">You do not have the necessary credentials to access the moderation panel.</p>
          <Link href="/dashboard" className="px-8 py-3 bg-[#1A1A1A] text-white text-xs tracking-widest uppercase font-bold transition-colors hover:bg-[#474747]">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] p-8 md:p-16">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-12 hover:text-[#777777] transition-colors">
          <ArrowLeft size={14} /> Back to Workspace
        </Link>

        <header className="mb-12 border-b border-[#1A1A1A] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#777777] mb-4 block">
              Moderation Panel
            </span>
            <h1 className="font-display text-5xl md:text-6xl flex items-center gap-4">
              Comments.
            </h1>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-[#1A1A1A]">
            <Loader2 className="animate-spin mb-4" size={24} />
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777]">Loading Records</p>
          </div>
        ) : error ? (
          <div className="p-8 border border-[#E05555] bg-[#FEF2F2] text-[#E05555] text-center">
            {error}
          </div>
        ) : comments.length === 0 ? (
          <div className="p-24 bg-white border border-[#1A1A1A] text-center">
            <p className="text-[#777777] italic">No comments found.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#1A1A1A]">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#1A1A1A] bg-[#F9FAFB] text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777] hidden md:grid">
              <div className="col-span-3">Author / Date</div>
              <div className="col-span-4">Comment</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            <div className="divide-y divide-[#E5E5E5]">
              {comments.map((c) => (
                <div key={c.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 hover:bg-[#F9FAFB] transition-colors group items-start">
                  <div className="col-span-1 md:col-span-3">
                    <h3 className="font-bold text-sm tracking-tight">{c.author_name || 'Anonymous'}</h3>
                    <p className="text-[10px] font-mono text-[#777777] mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
                    <p className="text-[10px] font-mono text-[#474747] mt-2 italic truncate max-w-[200px]">on: {c.post_title}</p>
                  </div>
                  <div className="col-span-1 md:col-span-4">
                    <p className="text-xs text-[#474747] line-clamp-3">{c.body}</p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    {c.is_approved ? (
                      <span className="text-[10px] font-bold tracking-widest uppercase text-green-600 flex items-center gap-1">
                        <Check size={12} /> Approved
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#E05555] flex items-center gap-1">
                        <Loader2 size={12} /> Pending
                      </span>
                    )}
                  </div>
                  <div className="col-span-1 md:col-span-3 flex items-center md:justify-end gap-4">
                    <button 
                      onClick={() => handleToggleApproval(c.id, c.is_approved)}
                      className={`text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 ${
                        c.is_approved ? 'text-[#777777] hover:text-[#1A1A1A]' : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {c.is_approved ? <><X size={12} /> Revoke</> : <><Check size={12} /> Approve</>}
                    </button>
                    <button 
                      onClick={() => handleDelete(c.id)}
                      className="text-[10px] font-bold tracking-widest uppercase text-[#E05555] hover:text-[#B91C1C] flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CommentsManagement() {
  return (
    <ProtectedRoute>
      <CommentsManagementPage />
    </ProtectedRoute>
  );
}
