'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.avatarUrl) {
      setAvatarUrl(user.avatarUrl);
    }
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      try {
        setMessage({ type: 'info', text: 'Uploading image...' });
        const res = await apiFetch('/upload', { method: 'POST', body: formData });
        if (res.success) {
          setAvatarUrl(res.data.url);
          setMessage({ type: 'success', text: 'Image uploaded successfully. Don\'t forget to save!' });
        } else {
          setMessage({ type: 'error', text: res.message || 'Upload failed' });
        }
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Upload failed' });
      }
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await apiFetch('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ avatarUrl }),
      });

      if (res.success) {
        updateUser({ avatarUrl: res.data.user.avatarUrl });
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] p-8 md:p-16">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-12 hover:text-[#777777] transition-colors">
          <ArrowLeft size={14} /> Back to Workspace
        </Link>

        <header className="mb-12 border-b border-[#1A1A1A] pb-8">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#777777] mb-4 block">
            Personal Settings
          </span>
          <h1 className="font-display text-5xl md:text-6xl mb-4">
            Profile.
          </h1>
        </header>

        {message.text && (
          <div className={`mb-8 p-4 border text-sm ${
            message.type === 'error' ? 'border-[#E05555] bg-[#FEF2F2] text-[#E05555]' : 
            message.type === 'success' ? 'border-green-600 bg-green-50 text-green-700' :
            'border-blue-600 bg-blue-50 text-blue-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white border border-[#1A1A1A] p-8">
          <div className="mb-8">
            <h3 className="font-bold text-sm tracking-widest uppercase mb-4">Avatar</h3>
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-full border border-[#1A1A1A] overflow-hidden bg-[#FAFAFA] flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[#777777] text-xs uppercase">No Image</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer px-6 py-3 bg-[#1A1A1A] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#474747] transition-colors inline-block"
                >
                  Change Avatar
                </label>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold tracking-widest uppercase text-[#1A1A1A] mb-2">
              Username
            </label>
            <input
              type="text"
              value={user?.username || ''}
              disabled
              className="w-full bg-[#FAFAFA] border border-[#E5E5E5] text-[#777777] px-4 py-3 text-sm cursor-not-allowed"
            />
          </div>

          <div className="mb-8">
            <label className="block text-xs font-bold tracking-widest uppercase text-[#1A1A1A] mb-2">
              Email
            </label>
            <input
              type="text"
              value={user?.email || ''}
              disabled
              className="w-full bg-[#FAFAFA] border border-[#E5E5E5] text-[#777777] px-4 py-3 text-sm cursor-not-allowed"
            />
          </div>

          <div className="pt-8 border-t border-[#E5E5E5]">
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#1A1A1A] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#474747] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
