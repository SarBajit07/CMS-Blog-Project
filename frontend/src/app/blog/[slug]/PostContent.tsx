'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';
import CommentsSection from '@/components/CommentsSection';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string;
  author_name: string;
  published_at: string;
  categories?: Category[];
  tags?: Tag[];
}

interface PostContentProps {
  post: Post;
}

export default function PostContent({ post }: PostContentProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'DRAFT';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A]">
      <article className="max-w-4xl mx-auto px-6 py-20 animate-fade-in">
        
        {/* Back Link */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-12 hover:text-[#777777] transition-colors">
          <ArrowLeft size={14} /> Back to Archive
        </Link>

        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories?.map(cat => (
              <span key={cat.id} className="px-2 py-1 bg-[#1A1A1A] text-white text-[9px] font-bold tracking-[0.2em] uppercase">
                {cat.name}
              </span>
            ))}
          </div>

          <h1 className="font-display text-5xl md:text-7xl leading-tight mb-8 tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-8 py-6 border-y border-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777]">By</span>
              <span className="text-xs font-bold uppercase tracking-widest underline decoration-1 underline-offset-4 cursor-default">
                {post.author_name}
              </span>
            </div>
            
            <div className="flex items-center gap-2 pl-8 border-l border-[#E5E5E5]">
              <Clock size={14} className="text-[#777777]" />
              <span className="text-xs font-mono text-[#777777]">
                {formatDate(post.published_at)}
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="mb-16 border border-[#1A1A1A] overflow-hidden">
            <img 
              src={post.cover_image_url} 
              alt={post.title} 
              className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out"
            />
          </div>
        )}

        {/* Excerpt (Intro) */}
        {post.excerpt && (
          <div className="mb-12">
            <p className="text-xl md:text-2xl font-light italic leading-relaxed text-[#474747]">
              {post.excerpt}
            </p>
          </div>
        )}

        {/* Body Content */}
        <div 
          className="blog-content mb-20"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#777777] self-center">Keywords:</span>
            {post.tags.map(tag => (
              <span key={tag.id} className="text-[11px] font-mono border border-[#E5E5E5] px-3 py-1 text-[#474747]">
                #{tag.slug}
              </span>
            ))}
          </div>
        )}

        {/* Footer / End of Article */}
        <footer className="mt-24 pt-12 border-t border-[#1A1A1A] flex flex-col items-center text-center">
          <div className="w-12 h-[1px] bg-[#1A1A1A] mb-8" />
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#777777]">
            End of Record
          </p>
        </footer>

        {/* Comments System */}
        {post && <CommentsSection postId={post.id} />}

      </article>
    </div>
  );
}
