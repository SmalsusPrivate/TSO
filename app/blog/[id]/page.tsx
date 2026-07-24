'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/utils';
import { useContent } from '@/components/ContentContext';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function BlogPostPage() {
  const content = useContent();
  const params = useParams();
  const id = Number(params.id);
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        
        // Fetch single post
        const res = await fetch(`${baseUrl}/api/blogs/${id}`);
        const data = await res.json();
        
        if (data.status === 'success') {
          const fetchedPost = data.data;
          // Ensure tags are parsed if they come as JSON string
          if (typeof fetchedPost.tags === 'string') {
            try { fetchedPost.tags = JSON.parse(fetchedPost.tags); } catch (e) { fetchedPost.tags = []; }
          }
          setPost(fetchedPost);
          
          // Fetch related posts
          const resAll = await fetch(`${baseUrl}/api/blogs`);
          const dataAll = await resAll.json();
          if (dataAll.status === 'success') {
            const allPosts = dataAll.data.map((p: any) => ({
              ...p,
              tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags
            }));
            setRelated(allPosts.filter((p: any) => p.id !== fetchedPost.id && p.category === fetchedPost.category).slice(0, 2));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>{content['blog_post_loading'] || 'Loading article...'}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{ background: 'var(--bg-primary)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="label-text text-[#007AFF] mb-4">{content['blog_post_404_label'] || '404'}</p>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            {content['blog_post_404_title'] || 'Article not found'}
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-tertiary)' }}>
            {content['blog_post_404_desc'] || "This article doesn't exist or has been moved."}
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold"
            style={{ background: '#007AFF' }}
          >
            <ArrowLeft className="w-4 h-4" /> {content['blog_post_back_btn'] || 'Back to Blog'}
          </Link>
        </motion.div>
      </div>
    );
  }

  // Format date if needed, assuming publishDate is ISO string
  const formattedDate = post.publishDate ? new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  
  // Split content by double newlines for paragraphs
  const paragraphs = post.content ? post.content.split('\n\n') : [];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        <div className="absolute inset-0">
          <img
            src={resolveMediaUrl(post.coverImage || post.thumbnail)}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{ opacity: 0.25 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent" style={{ background: `linear-gradient(to top, var(--bg-primary) 30%, transparent 100%)` }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-14 pt-36"
        >
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover:text-[#007AFF]"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <ArrowLeft className="w-4 h-4" /> {content['blog_post_back_btn'] || 'Back to Blog'}
          </Link>

          {/* Category badge */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
              style={{ color: post.color || '#007AFF', background: `${post.color || '#007AFF'}18`, border: `1px solid ${post.color || '#007AFF'}30` }}
            >
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 text-sm" style={{ color: 'var(--text-tertiary)' }}>
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{post.author}</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />{formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />{post.readTime}
            </span>
          </div>
        </motion.div>
      </section>

      {/* Article content */}
      <article className="max-w-3xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="space-y-6"
        >
          {paragraphs.map((p: string, i: number) => {
            // Very basic parsing for demo: if it looks like a heading, style it
            if (p.length < 100 && !p.includes('.') && (p.startsWith('Step') || p.match(/^[A-Z][a-z]+:/) || i === 0 && p.length < 50)) {
               return (
                <h2
                  key={i}
                  className="text-2xl font-bold tracking-tight pt-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {p}
                </h2>
               )
            }
            return (
              <p
                key={i}
                className="text-base leading-[1.85] font-light"
                style={{ color: 'var(--text-secondary)' }}
              >
                {p}
              </p>
            );
          })}
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-2 mt-12 pt-8"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <Tag className="w-4 h-4 mt-0.5" style={{ color: 'var(--text-muted)' }} />
          {post.tags && post.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ color: 'var(--text-tertiary)', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)' }}
            >
              #{tag}
            </span>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-2xl p-8 text-center"
          style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(20px)' }}
        >
          <p className="label-text text-[#007AFF] mb-3">{content['blog_post_cta_label'] || 'Ready to Start?'}</p>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            {content['blog_post_cta_title'] || 'Join Talent Shapers Orbit'}
          </h3>
          <p className="text-sm mb-6 font-light" style={{ color: 'var(--text-tertiary)' }}>
            {content['blog_post_cta_desc'] || 'Book a free demo class and experience the TSO difference.'}
          </p>
          <Link
            href="https://wa.me/919560952733"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold hover:opacity-90 transition-all duration-300 hover:scale-[1.03]"
            style={{ background: 'linear-gradient(135deg, #007AFF, #0055CC)' }}
          >
            {content['blog_post_cta_btn'] || 'Book Free Demo Class'} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div style={{ borderTop: '1px solid var(--border-subtle)' }} className="pt-16">
            <p className="label-text mb-8">{content['blog_post_related_label'] || 'Related Articles'}</p>
            <div className="grid sm:grid-cols-2 gap-5">
              {related.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                  className="group rounded-2xl overflow-hidden"
                  style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-glass)', backdropFilter: 'blur(20px)' }}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={resolveMediaUrl(r.coverImage || r.thumbnail)}
                      alt={r.title}
                      className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span
                      className="text-[9px] font-bold tracking-widest uppercase"
                      style={{ color: r.color || '#007AFF' }}
                    >
                      {r.category}
                    </span>
                    <h4
                      className="font-bold text-sm mt-1 mb-3 leading-snug group-hover:text-[#007AFF] transition-colors line-clamp-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {r.title}
                    </h4>
                    <Link
                      href={`/blog/${r.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold"
                      style={{ color: r.color || '#007AFF' }}
                    >
                      {content['blog_read_btn'] || 'Read'} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
