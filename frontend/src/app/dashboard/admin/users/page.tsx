'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Edit2, Trash2, X, Check, Shield } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

function UsersManagementPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('author');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/users');
      if (response.success) {
        setUsers(response.data.users || response.data);
      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id: number) => {
    setIsSubmitting(true);
    try {
      const response = await apiFetch(`/users/${id}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: selectedRole }),
      });
      if (response.success) {
        setUsers(users.map(u => u.id === id ? response.data.user : u));
        setEditingId(null);
        toast.success('User role updated');
      } else {
        toast.error(response.message || 'Failed to update user role');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure? This will permanently delete the user and their posts.")) return;
    try {
      const response = await apiFetch(`/users/${id}`, {
        method: 'DELETE',
      });
      if (response.success) {
        setUsers(users.filter(u => u.id !== id));
        toast.success('User deleted');
      } else {
        toast.error(response.message || 'Failed to delete user');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setSelectedRole(user.role);
  };

  const cancelAction = () => {
    setEditingId(null);
  };

  if (user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-4xl mb-4">Unauthorized Access</h1>
          <p className="text-[#474747] mb-8">You do not have the necessary credentials to access the user management vault.</p>
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
              System Administration
            </span>
            <h1 className="font-display text-5xl md:text-6xl flex items-center gap-4">
              Users.
            </h1>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-[#1A1A1A]">
            <Loader2 className="animate-spin mb-4" size={24} />
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777]">Indexing Personnel</p>
          </div>
        ) : error ? (
          <div className="p-8 border border-[#E05555] bg-[#FEF2F2] text-[#E05555] text-center">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="p-24 bg-white border border-[#1A1A1A] text-center">
            <p className="text-[#777777] italic">No users found.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#1A1A1A]">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#1A1A1A] bg-[#F9FAFB] text-[10px] font-bold tracking-[0.2em] uppercase text-[#777777] hidden md:grid">
              <div className="col-span-3">User</div>
              <div className="col-span-4">Email</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            <div className="divide-y divide-[#E5E5E5]">
              {users.map((u) => (
                <div key={u.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-[#F9FAFB] transition-colors group">
                  <div className="col-span-1 md:col-span-3">
                    <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                      {u.username}
                      {u.id === user?.id && <span className="bg-[#1A1A1A] text-white text-[8px] px-2 py-0.5 uppercase tracking-wider rounded-full">You</span>}
                    </h3>
                    <p className="text-[10px] font-mono text-[#777777]">Joined {new Date(u.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-1 md:col-span-4">
                    <p className="text-xs text-[#474747]">{u.email}</p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    {editingId === u.id ? (
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="bg-[#FAFAFA] border border-[#1A1A1A] px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                      >
                        <option value="author">Author</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    ) : (
                      <span className={`text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 ${
                        u.role === 'superadmin' ? 'text-[#1A1A1A]' : 
                        u.role === 'admin' ? 'text-[#777777]' : 'text-[#A3A3A3]'
                      }`}>
                        {u.role === 'superadmin' && <Shield size={10} />}
                        {u.role}
                      </span>
                    )}
                  </div>
                  <div className="col-span-1 md:col-span-3 flex items-center md:justify-end gap-4">
                    {editingId === u.id ? (
                      <>
                        <button 
                          onClick={() => handleUpdateRole(u.id)}
                          disabled={isSubmitting}
                          className="text-[10px] font-bold tracking-widest uppercase hover:text-[#777777] flex items-center gap-1 disabled:opacity-50"
                        >
                          {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                        </button>
                        <button 
                          onClick={cancelAction}
                          disabled={isSubmitting}
                          className="text-[10px] font-bold tracking-widest uppercase hover:text-[#777777] flex items-center gap-1"
                        >
                          <X size={12} /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEdit(u)}
                          disabled={u.id === user?.id}
                          className="text-[10px] font-bold tracking-widest uppercase hover:text-[#777777] flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Edit2 size={12} /> Edit Role
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          disabled={u.id === user?.id}
                          className="text-[10px] font-bold tracking-widest uppercase text-[#E05555] hover:text-[#B91C1C] flex items-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </>
                    )}
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

export default function UsersManagement() {
  return (
    <ProtectedRoute>
      <UsersManagementPage />
    </ProtectedRoute>
  );
}
