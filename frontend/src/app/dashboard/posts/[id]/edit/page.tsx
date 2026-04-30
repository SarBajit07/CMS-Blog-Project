'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Save, Send } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RichTextEditor from '@/components/dashboard/RichTextEditor';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  excerpt: z.string().max(500, 'Excerpt is too long').optional(),
  body: z.string().min(1, 'Story content is required'),
  status: z.enum(['draft', 'published']),
  cover_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  categoryIds: z.array(z.number()).optional(),
  tagIds: z.array(z.number()).optional(),
});

type PostFormData = z.infer<typeof postSchema>;

function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [tags, setTags] = useState<{id: number, name: string}[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      body: '',
      cover_image_url: '',
      status: 'draft',
      categoryIds: [],
      tagIds: [],
    },
  });

  const currentStatus = watch('status');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiFetch(`/posts/id/${id}`);
        if (response.success) {
          const post = response.data.post;
          reset({
            title: post.title,
            excerpt: post.excerpt || '',
            body: post.body,
            cover_image_url: post.cover_image_url || '',
            status: post.status,
            categoryIds: post.categories?.map((c: any) => c.id) || [],
            tagIds: post.tags?.map((t: any) => t.id) || [],
          });
        } else {
          setFetchError(response.message || 'Failed to load story');
        }
      } catch (err: any) {
        setFetchError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchMetadata = async () => {
      try {
        const [catsRes, tagsRes] = await Promise.all([
          apiFetch('/categories'),
          apiFetch('/tags')
        ]);
        if (catsRes.success) setCategories(catsRes.data.categories);
        if (tagsRes.success) setTags(tagsRes.data.tags);
      } catch (err) {
        console.error('Failed to fetch categories/tags', err);
      }
    };

    if (id) {
      fetchPost();
      fetchMetadata();
    }
  }, [id, reset]);

  const onSubmit = async (data: PostFormData) => {
    setSubmitError(null);
    try {
      const response = await apiFetch(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (response.success) {
        toast.success('Story updated successfully');
        // Redirect back to dashboard on success
        router.push('/dashboard');
        router.refresh();
      } else {
        setSubmitError(response.message || 'Failed to update story');
        toast.error(response.message || 'Failed to update story');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred');
      toast.error(err.message || 'An unexpected error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1A1A1A]" size={32} />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-display text-4xl mb-4">Error loading edition</h1>
        <p className="text-[#474747] mb-8">{fetchError}</p>
        <Link href="/dashboard" className="px-8 py-3 bg-[#1A1A1A] text-white text-xs tracking-widest uppercase font-bold transition-colors hover:bg-[#474747]">
          Back to Workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-12 hover:text-[#777777] transition-colors">
          <ArrowLeft size={14} /> Back to Workspace
        </Link>

        <header className="mb-12 border-b border-[#1A1A1A] pb-8">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#777777] mb-4 block">
            Edit Edition
          </span>
          <h1 className="font-display text-5xl md:text-6xl mb-4">
            Revise Story
          </h1>
          <p className="text-lg text-[#474747] font-light max-w-2xl">
            Make adjustments to your narrative before or after it goes to print.
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
            <RichTextEditor 
              value={watch('body')} 
              onChange={(value) => setValue('body', value, { shouldValidate: true })}
              placeholder="Begin your draft here. Let your story unfold..."
            />
            {errors.body && <p className="mt-2 text-xs text-[#E05555]">{errors.body.message}</p>}
            <p className="mt-2 text-xs text-[#777777]">The editor automatically saves your formatting as you write.</p>
          </div>

          {/* Cover Image URL */}
          <div>
            <label htmlFor="cover_image_url" className="block text-xs font-bold tracking-widest uppercase text-[#1A1A1A] mb-2">
              Cover Image
            </label>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <input
                id="cover_image_url"
                type="text"
                placeholder="https://example.com/image.jpg"
                className={`flex-1 w-full bg-white border ${errors.cover_image_url ? 'border-[#E05555]' : 'border-[#1A1A1A]'} text-[#1A1A1A] px-4 py-3 text-sm font-light placeholder:text-[#A3A3A3] outline-none focus:ring-1 focus:ring-[#1A1A1A] transition-all`}
                {...register('cover_image_url')}
              />
              <button
                type="button"
                className="px-6 py-3 bg-[#1A1A1A] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#474747] transition-colors whitespace-nowrap h-[46px]"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async () => {
                    if (input.files && input.files[0]) {
                      const file = input.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        const res = await apiFetch('/upload', { method: 'POST', body: formData });
                        if (res.success) {
                          setValue('cover_image_url', res.data.url, { shouldValidate: true });
                          toast.success('Cover image uploaded');
                        } else {
                          toast.error(res.message || 'Upload failed');
                        }
                      } catch (err) {
                        toast.error('Upload failed');
                      }
                    }
                  };
                  input.click();
                }}
              >
                Upload File
              </button>
            </div>
            {watch('cover_image_url') && (
              <div className="mt-4 border border-[#1A1A1A] p-2 inline-block">
                <img src={watch('cover_image_url')} alt="Cover Preview" className="h-32 object-cover" />
              </div>
            )}
            {errors.cover_image_url && <p className="mt-2 text-xs text-[#E05555]">{errors.cover_image_url.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Categories */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[#1A1A1A] mb-2">
                Categories
              </label>
              <div className="space-y-2 border border-[#1A1A1A] bg-white p-4 max-h-48 overflow-y-auto">
                {categories.length === 0 ? (
                  <p className="text-sm text-[#777777] italic">No categories available</p>
                ) : (
                  categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        value={cat.id}
                        className="accent-[#1A1A1A]"
                        {...register('categoryIds', {
                          setValueAs: (value) => {
                            if (!value) return [];
                            return Array.isArray(value) ? value.map(Number) : [Number(value)];
                          }
                        })}
                      />
                      {cat.name}
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-[#1A1A1A] mb-2">
                Tags
              </label>
              <div className="space-y-2 border border-[#1A1A1A] bg-white p-4 max-h-48 overflow-y-auto">
                {tags.length === 0 ? (
                  <p className="text-sm text-[#777777] italic">No tags available</p>
                ) : (
                  tags.map(tag => (
                    <label key={tag.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        value={tag.id}
                        className="accent-[#1A1A1A]"
                        {...register('tagIds', {
                          setValueAs: (value) => {
                            if (!value) return [];
                            return Array.isArray(value) ? value.map(Number) : [Number(value)];
                          }
                        })}
                      />
                      {tag.name}
                    </label>
                  ))
                )}
              </div>
            </div>
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
                'Update Story'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditPost() {
  return (
    <ProtectedRoute>
      <EditPostPage />
    </ProtectedRoute>
  );
}
