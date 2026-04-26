'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Save, Send } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  excerpt: z.string().max(500, 'Excerpt is too long').optional(),
  body: z.string().min(1, 'Story content is required'),
  status: z.enum(['draft', 'published']),
  cover_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type PostFormData = z.infer<typeof postSchema>;

function CreatePostPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      body: '',
      cover_image_url: '',
      status: 'draft',
    },
  });

  const currentStatus = watch('status');

  const onSubmit = async (data: PostFormData) => {
    setSubmitError(null);
    try {
      const response = await apiFetch('/posts', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response.success) {
        // Redirect back to dashboard on success
        router.push('/dashboard');
        router.refresh();
      } else {
        setSubmitError(response.message || 'Failed to create story');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-12 hover:text-[#777777] transition-colors">
          <ArrowLeft size={14} /> Back to Workspace
        </Link>

        <header className="mb-12 border-b border-[#1A1A1A] pb-8">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#777777] mb-4 block">
            New Edition
          </span>
          <h1 className="font-display text-5xl md:text-6xl mb-4">
            Compose Story
          </h1>
          <p className="text-lg text-[#474747] font-light max-w-2xl">
            Draft your thoughts, shape your narrative, and prepare it for the broadsheet.
          </p>
        </header>

        {submitError && (
          <div className="mb-8 p-4 border border-[#E05555] bg-[#FEF2F2] text-[#E05555] text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-bold tracking-widest uppercase text-[#1A1A1A] mb-2">
              Headline <span className="text-[#E05555]">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="THE ARCHITECTURE OF SILENCE..."
              className={`w-full bg-white border ${errors.title ? 'border-[#E05555]' : 'border-[#1A1A1A]'} text-[#1A1A1A] px-4 py-4 font-display text-2xl md:text-3xl placeholder:text-[#A3A3A3] outline-none focus:ring-1 focus:ring-[#1A1A1A] transition-all`}
              {...register('title')}
            />
            {errors.title && <p className="mt-2 text-xs text-[#E05555]">{errors.title.message}</p>}
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-xs font-bold tracking-widest uppercase text-[#1A1A1A] mb-2">
              Brief Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={2}
              placeholder="A short summary of the narrative..."
              className={`w-full bg-white border ${errors.excerpt ? 'border-[#E05555]' : 'border-[#1A1A1A]'} text-[#1A1A1A] px-4 py-3 text-sm font-light placeholder:text-[#A3A3A3] outline-none focus:ring-1 focus:ring-[#1A1A1A] transition-all resize-none`}
              {...register('excerpt')}
            />
            {errors.excerpt && <p className="mt-2 text-xs text-[#E05555]">{errors.excerpt.message}</p>}
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-xs font-bold tracking-widest uppercase text-[#1A1A1A] mb-2">
              Body Copy <span className="text-[#E05555]">*</span>
            </label>
            <div className="border border-[#1A1A1A] bg-white group focus-within:ring-1 focus-within:ring-[#1A1A1A] transition-all">
              {/* Fake Toolbar for visual aesthetics */}
              <div className="flex items-center gap-4 px-4 py-2 border-b border-[#E5E5E5] text-[#777777]">
                <span className="text-xs font-bold font-serif px-2 border border-transparent hover:border-[#E5E5E5] cursor-pointer">B</span>
                <span className="text-xs italic font-serif px-2 border border-transparent hover:border-[#E5E5E5] cursor-pointer">I</span>
                <span className="text-xs font-bold px-2 border border-transparent hover:border-[#E5E5E5] cursor-pointer">H1</span>
                <span className="text-xs font-bold px-2 border border-transparent hover:border-[#E5E5E5] cursor-pointer">H2</span>
              </div>
              <textarea
                id="body"
                rows={16}
                placeholder="Begin your draft here. HTML tags are supported for formatting (e.g., <p>, <h2>, <strong>)..."
                className="w-full bg-transparent text-[#1A1A1A] px-4 py-6 text-base font-light leading-relaxed placeholder:text-[#A3A3A3] outline-none resize-y"
                {...register('body')}
              />
            </div>
            {errors.body && <p className="mt-2 text-xs text-[#E05555]">{errors.body.message}</p>}
            <p className="mt-2 text-xs text-[#777777]">In this version, you can write pure HTML to format your post.</p>
          </div>

          {/* Cover Image URL */}
          <div>
            <label htmlFor="cover_image_url" className="block text-xs font-bold tracking-widest uppercase text-[#1A1A1A] mb-2">
              Cover Image URL
            </label>
            <input
              id="cover_image_url"
              type="text"
              placeholder="https://example.com/image.jpg"
              className={`w-full bg-white border ${errors.cover_image_url ? 'border-[#E05555]' : 'border-[#1A1A1A]'} text-[#1A1A1A] px-4 py-3 text-sm font-light placeholder:text-[#A3A3A3] outline-none focus:ring-1 focus:ring-[#1A1A1A] transition-all`}
              {...register('cover_image_url')}
            />
            {errors.cover_image_url && <p className="mt-2 text-xs text-[#E05555]">{errors.cover_image_url.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-8 border-t border-[#E5E5E5]">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setValue('status', 'draft')}
                className={`px-6 py-3 border border-[#1A1A1A] text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 ${currentStatus === 'draft' ? 'bg-[#E5E5E5] text-[#1A1A1A]' : 'bg-transparent text-[#1A1A1A] hover:bg-[#F0F0F0]'}`}
              >
                <Save size={14} /> Draft
              </button>
              <button
                type="button"
                onClick={() => setValue('status', 'published')}
                className={`px-6 py-3 border border-[#1A1A1A] text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 ${currentStatus === 'published' ? 'bg-[#E5E5E5] text-[#1A1A1A]' : 'bg-transparent text-[#1A1A1A] hover:bg-[#F0F0F0]'}`}
              >
                <Send size={14} /> Publish
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-[#1A1A1A] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#474747] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={14} /> Saving
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreatePost() {
  return (
    <ProtectedRoute>
      <CreatePostPage />
    </ProtectedRoute>
  );
}
