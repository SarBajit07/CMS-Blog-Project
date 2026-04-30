'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2, MessageSquare, Send } from 'lucide-react';

interface Comment {
  id: number;
  body: string;
  author_name: string;
  avatar_url: string | null;
  created_at: string;
  is_approved: boolean;
}

export default function CommentsSection({ postId }: { postId: number }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/comments/post/${postId}`);
      if (response.success) {
        setComments(response.data.comments || []);
      }
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await apiFetch(`/comments/post/${postId}`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });

      if (response.success) {
        setBody('');
        if (user && (user.role === 'admin' || user.role === 'superadmin')) {
          fetchComments();
          toast.success('Comment published');
        } else {
          toast.info('Comment submitted! It will be visible once approved.');
        }
      } else {
        toast.error(response.message || 'Failed to submit comment');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-[#E5E5E5]">
      <h3 className="font-display text-2xl mb-8 flex items-center gap-2">
        <MessageSquare size={20} /> Discourse
      </h3>

      {/* Comment Form */}
      <div className="mb-12 bg-white border border-[#1A1A1A] p-6">
        <h4 className="text-[10px] font-bold tracking-widest uppercase mb-4 text-[#1A1A1A]">
          Add to the Record
        </h4>
        <form onSubmit={handleSubmit}>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={user ? "Write your thoughts here..." : "You are commenting anonymously. Write your thoughts here..."}
            className="w-full bg-[#FAFAFA] border border-[#E5E5E5] p-4 text-sm outline-none focus:border-[#1A1A1A] transition-colors resize-none mb-4"
            rows={4}
            required
          />
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-[#777777] uppercase tracking-widest">
              {user ? `Posting as ${user.username}` : 'Posting anonymously'}
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !body.trim()}
              className="px-6 py-3 bg-[#1A1A1A] text-white text-[10px] font-bold tracking-widest uppercase hover:bg-[#474747] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Comment List */}
      <div>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 bg-white border border-[#E5E5E5] animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-3 w-20 bg-gray-200" />
                  <div className="h-2 w-16 bg-gray-100" />
                </div>
                <div className="h-3 w-full bg-gray-100 mb-2" />
                <div className="h-3 w-4/5 bg-gray-100" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-[#777777] italic py-8">No records of discourse found.</p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="p-6 bg-white border border-[#E5E5E5]">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest decoration-1 underline-offset-4 underline cursor-default">
                    {comment.author_name || 'Anonymous'}
                  </span>
                  <span className="text-[10px] font-mono text-[#777777]">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#474747] whitespace-pre-wrap">{comment.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
