'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

interface Tag {
  id: number;
  name: string;
  slug: string;
}

function TagsManagementPage() {
  const { user } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/tags');
      if (response.success) {
        setTags(response.data.tags);
      } else {
        setError(response.message || 'Failed to load tags');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiFetch('/tags', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      if (response.success) {
        setTags([...tags, response.data.tag]);
        setIsAdding(false);
        setFormData({ name: '' });
      } else {
        alert(response.message || 'Failed to create tag');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setIsSubmitting(true);
    try {
      const response = await apiFetch(`/tags/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      if (response.success) {
        setTags(tags.map(t => t.id === editingId ? response.data.tag : t));
        setEditingId(null);
        setFormData({ name: '' });
      } else {
        alert(response.message || 'Failed to update tag');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure? This will remove the tag from all associated posts.")) return;
    try {
      const response = await apiFetch(`/tags/${id}`, {
        method: 'DELETE',
      });
      if (response.success) {
        setTags(tags.filter(t => t.id !== id));
      } else {
        alert(response.message || 'Failed to delete tag');
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setFormData({ name: tag.name });
    setIsAdding(false);
  };

  const cancelAction = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '' });
  };

  if (user?.role !== 'admin' && user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-4xl mb-4">Unauthorized Access</h1>
          <p className="text-[#474747] mb-8">You do not have the necessary credentials to access the taxonomy management vault.</p>
          <Link href="/dashboard" className="px-8 py-3 bg-[#1A1A1A] text-white text-xs tracking-widest uppercase font-bold transition-colors hover:bg-[#474747]">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-12 hover:text-[#777777] transition-colors">
          <ArrowLeft size={14} /> Back to Workspace
        </Link>

        <header className="mb-12 border-b border-[#1A1A1A] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#777777] mb-4 block">
              Taxonomy Management
            </span>
            <h1 className="font-display text-5xl md:text-6xl">
              Tags.
            </h1>
          </div>
          {!isAdding && !editingId && (
            <button 
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#474747] transition-colors"
            >
              <Plus size={14} /> Add Tag
            </button>
          )}
        </header>

        {(isAdding || editingId) && (
          <section className="mb-16 border border-[#1A1A1A] bg-white p-8 animate-fade-in">
            <h2 className="font-display text-2xl mb-8 border-b border-[#E5E5E5] pb-4">
              {isAdding ? 'Establish New Tag' : 'Modify Existing Tag'}
            </h2>
            <form onSubmit={editingId ? handleUpdate : handleCreate} className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#1A1A1A] mb-2">Tag Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., lifestyle, minimal, tech..."
                  className="w-full bg-[#FAFAFA] border border-[#1A1A1A] px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#1A1A1A] transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-[#1A1A1A] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#474747] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {editingId ? 'Confirm Changes' : 'Create Tag'}
                </button>
                <button 
                  type="button" 
                  onClick={cancelAction}
                  className="px-8 py-3 border border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-bold tracking-widest uppercase hover:bg-[#F0F0F0] transition-colors flex items-center gap-2"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-[#1A1A1A]">
            <Loader2 className="animate-spin mb-4" size={24} />
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777]">Indexing Keywords</p>
          </div>
        ) : error ? (
          <div className="p-8 border border-[#E05555] bg-[#FEF2F2] text-[#E05555] text-center">
            {error}
          </div>
        ) : tags.length === 0 ? (
          <div className="p-24 bg-white border border-[#1A1A1A] text-center">
            <p className="text-[#777777] italic">No tags have been established yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#1A1A1A]">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#1A1A1A] bg-[#F9FAFB] text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777] hidden md:grid">
              <div className="col-span-4">Name / Slug</div>
              <div className="col-span-8 text-right">Actions</div>
            </div>
            <div className="divide-y divide-[#E5E5E5]">
              {tags.map((tag) => (
                <div key={tag.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-[#F9FAFB] transition-colors group">
                  <div className="col-span-1 md:col-span-4">
                    <h3 className="font-bold text-sm tracking-tight">{tag.name}</h3>
                    <p className="text-[10px] font-mono text-[#777777]">#{tag.slug}</p>
                  </div>
                  <div className="col-span-1 md:col-span-8 flex items-center md:justify-end gap-6">
                    <button 
                      onClick={() => startEdit(tag)}
                      className="text-[10px] font-bold tracking-widest uppercase hover:text-[#777777] flex items-center gap-1"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(tag.id)}
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

export default function TagsManagement() {
  return (
    <ProtectedRoute>
      <TagsManagementPage />
    </ProtectedRoute>
  );
}
