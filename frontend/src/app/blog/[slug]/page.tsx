import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostContent from './PostContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getPost(slug: string) {
  const res = await fetch(`${API_URL}/posts/${slug}`, {
    next: { revalidate: 60 } // Cache for 60 seconds
  });
  
  if (!res.ok) return null;
  const data = await res.json();
  return data.success ? data.data.post : null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | The Archive',
    };
  }

  return {
    title: `${post.title} | The Archive`,
    description: post.excerpt || post.body.replace(/<[^>]*>/g, '').substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url ? [post.cover_image_url] : [],
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author_name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  };
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return <PostContent post={post} />;
}
