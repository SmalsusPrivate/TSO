'use client';

import { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { resolveMediaUrl } from '@/lib/utils';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, Clock, ChevronDown } from 'lucide-react';
import { useContent } from '@/components/ContentContext';
import Fuse from 'fuse.js';

const EASE_AVP = [0.16, 1, 0.3, 1] as const;

function Particles({ count = 20 }: { count?: number }) {
  const pts = useRef(Array.from({ length: count }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2 + 0.5, op: Math.random() * 0.25 + 0.06, dur: Math.random() * 8 + 5, delay: Math.random() * 4 })));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.current.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-blue-400" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.op }}
          animate={{ y: [0, -20, 0], opacity: [p.op, p.op * 2, p.op] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}

const fallbackPosts = [
  { id: 1, title: 'How to Land Your First Python Developer Job in 2025',           excerpt: 'A complete roadmap from building your portfolio to acing the technical interview — from our placement team at TSO.',                                     category: 'Career Tips',    date: 'May 28, 2025',   readTime: '8 min',  img: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',  featured: true,  color: '#007AFF', tags: ['Python', 'Career', 'Job Search'] },
  { id: 2, title: 'AI & Machine Learning: What Skills Do You Actually Need?',       excerpt: 'Breaking down the real-world skills required to become an ML engineer — from fundamentals to specializations that companies hire for.',                       category: 'Tech Insights',  date: 'May 20, 2025',   readTime: '12 min', img: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',  featured: true,  color: '#34AADC', tags: ['AI', 'Machine Learning', 'Skills'] },
  { id: 3, title: 'MERN vs Full Stack Python: Which Should You Learn in 2025?',    excerpt: 'An honest, data-backed comparison of two of the most popular full-stack paths to help you make an informed career decision.',                                category: 'Tech Insights',  date: 'May 15, 2025',   readTime: '7 min',  img: 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=800',    featured: false, color: '#30D158', tags: ['MERN', 'Python', 'Comparison'] },
  { id: 4, title: 'Top 20 SharePoint Interview Questions for 2025',                 excerpt: 'Prepare for your SharePoint developer interview with this comprehensive list of commonly asked questions and expert answers.',                                  category: 'Interview Prep', date: 'May 10, 2025',   readTime: '10 min', img: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',  featured: false, color: '#FF9F0A', tags: ['SharePoint', 'Interview', 'Microsoft'] },
  { id: 5, title: "From Non-Tech Background to Developer: Ridhi's Journey at TSO", excerpt: 'How Ridhi transitioned from a marketing executive to a SharePoint developer at a top MNC within 5 months of joining TSO.',                                    category: 'Student Stories',date: 'May 5, 2025',    readTime: '5 min',  img: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=800',  featured: false, color: '#FF2D55', tags: ['Success Story', 'Career Change', 'TSO'] },
  { id: 6, title: 'Why Power Apps is the Most In-Demand Skill Right Now',          excerpt: "Microsoft Power Apps has exploded in demand. Here's why learning low-code development is one of the smartest moves you can make.",                           category: 'Industry News',  date: 'April 28, 2025', readTime: '6 min',  img: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=800',  featured: false, color: '#BF5AF2', tags: ['Power Apps', 'Microsoft', 'Demand'] },
  { id: 7, title: '7 Spoken English Mistakes That Will Cost You the Interview',    excerpt: "Our ex-Wipro communication trainer reveals the 7 spoken English mistakes that kill candidates' chances in technical and HR interviews.",                    category: 'Career Tips',    date: 'April 20, 2025', readTime: '6 min',  img: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',  featured: false, color: '#FF2D55', tags: ['Spoken English', 'Interview', 'Communication'] },
  { id: 8, title: 'How to Build a Tech Resume That Gets You Interviews',           excerpt: 'Expert tips from our placement team on crafting a resume that passes ATS filters and impresses hiring managers at top IT companies.',                          category: 'Career Tips',    date: 'April 15, 2025', readTime: '8 min',  img: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800',    featured: false, color: '#007AFF', tags: ['Resume', 'Career', 'Job Search'] },
];

export function generateSlug(id: number | string, title: string) {
  if (!title) return `/blog/${id}`;
  const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `/blog/${id}-${safeTitle}`;
}

function FeaturedPost({ post, delay }: { post: any; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: EASE_AVP }}
      className="group relative rounded-2xl overflow-hidden" style={{ minHeight: 420 }}
    >
      <img src={resolveMediaUrl(post.img)} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative z-10 h-full flex flex-col justify-end p-8">
        <div className="mb-auto flex items-center gap-3 pt-5">
          <span className="label-text text-[10px] px-3 py-1.5 rounded-full glass" style={{ color: post.color, background: `${post.color}15` }}>{post.category}</span>
        </div>
        <div className="mt-auto">
          <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-3 group-hover:text-[#007AFF] transition-colors duration-300">{post.title}</h2>
          <p className="text-white/55 text-sm leading-relaxed mb-5 max-w-sm font-light">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white/30 text-xs">
              <span>{post.date}</span><span>·</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
            </div>
            <Link href={generateSlug(post.id, post.title)} className="flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all duration-300" style={{ color: post.color }}>
              {post.content?.blog_read_btn || 'Read'} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PostCard({ post, delay }: { post: any; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: EASE_AVP }}
      whileHover={{ y: -3 }}
      className="group glass rounded-2xl overflow-hidden transition-all duration-500"
    >
      <div className="relative overflow-hidden h-44">
        <img src={resolveMediaUrl(post.img)} alt={post.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="label-text text-[9px] px-2.5 py-1 rounded-full" style={{ color: post.color, background: `${post.color}18`, border: `1px solid ${post.color}28` }}>{post.category}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-base leading-snug mb-2 group-hover:text-[#007AFF] transition-colors duration-300 line-clamp-2" style={{ color: 'var(--text-primary)' }}>{post.title}</h3>
        <p className="text-xs leading-relaxed mb-4 line-clamp-2 font-light" style={{ color: 'var(--text-tertiary)' }}>{post.excerpt}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((t: string) => <span key={t} className="text-[10px] px-2 py-0.5 rounded" style={{ color: 'var(--text-muted)', background: 'var(--bg-glass)' }}>#{t}</span>)}
        </div>
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{post.date} · {post.readTime}</span>
          <Link href={generateSlug(post.id, post.title)} className="flex items-center gap-1 text-xs font-semibold group-hover:gap-1.5 transition-all duration-300" style={{ color: post.color }}>
            {post.content?.blog_read_btn || 'Read'} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function BlogContent() {
  const content = useContent();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize state from URL
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [cat, setCat] = useState(searchParams.get('category') || 'All');

  // Pagination & UI States
  const [visibleCount, setVisibleCount] = useState(12);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const updateUrl = (newSearch: string, newCat: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('q', newSearch);
    if (newCat !== 'All') params.set('category', newCat);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    updateUrl(val, cat);
  };

  const handleCatChange = (newCat: string) => {
    setCat(newCat);
    updateUrl(search, newCat);
  };

  const handleClearSearch = () => {
    setSearch('');
    updateUrl('', cat);
  };
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY  = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOp = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const parsed = data.data
            .filter((p: any) => p.status === 'published')
            .map((p: any) => ({
            ...p,
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
            img: p.coverImage,
            date: new Date(p.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }));
          setPosts(parsed);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const displayPosts = posts.length ? posts : fallbackPosts;

  // Dynamically extract categories from the displayed posts
  const dynamicCategories = ['All', ...Array.from(new Set(displayPosts.map(p => p.category).filter(Boolean)))];
  const topCategories = dynamicCategories.slice(0, 5);
  const overflowCategories = dynamicCategories.slice(5);

  const featured = displayPosts.filter((p) => p.featured === 1 || p.featured === true);
  
  // Fuzzy Search setup
  const fuse = useMemo(() => new Fuse(displayPosts, { 
    keys: ['title', 'excerpt', 'category'],
    threshold: 0.3 
  }), [displayPosts]);

  const searchResults = search ? fuse.search(search).map(r => r.item) : displayPosts;
  const searchRecommendations = search && search.length > 2 ? fuse.search(search).slice(0, 3).map(r => r.item) : [];

  const rest = searchResults.filter((p) => {
    const matchCat = cat === 'All' || p.category === cat;
    return !(p.featured === 1 || p.featured === true) && matchCat;
  });

  const paginatedRest = rest.slice(0, visibleCount);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#007AFF] animate-spin"></div>
        </div>
      )}
      
      {/* HERO */}
      <section ref={heroRef} className="relative z-[60] min-h-[68vh] flex items-end pointer-events-none" style={{ background: 'var(--bg-primary)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-cinematic" />
          <div className="absolute inset-0 bg-grid" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[100px]" style={{ background: 'var(--orb-1)' }} />
        </div>
        <Particles count={22} />
        <motion.div style={{ y: heroY, opacity: heroOp }} className="relative z-10 w-full pb-16 pt-36 pointer-events-none">
          <div className="max-w-6xl mx-auto px-6">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="label-text text-[#007AFF] mb-6 pointer-events-auto">{content['blog_hero_label'] || 'Knowledge Hub'}</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: EASE_AVP }} className="hero-text max-w-3xl mb-6 pointer-events-auto" style={{ color: 'var(--text-primary)' }}>
              {content['blog_hero_title1'] || 'Insights for the'}<br /><span className="text-gradient-blue">{content['blog_hero_title2'] || 'ambitious.'}</span>
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="relative max-w-sm pointer-events-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              <input type="text" value={search} onChange={handleSearchChange} 
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder={content['blog_hero_search_placeholder'] || 'Search articles...'}
                className="w-full pl-10 pr-12 py-3.5 glass rounded-xl outline-none text-sm transition-colors relative z-10"
                style={{ color: 'var(--text-primary)', background: 'var(--bg-glass)' }} />
              <button onClick={() => updateUrl(search, cat)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 z-10 rounded-lg flex items-center justify-center bg-[#007AFF] text-white hover:bg-blue-600 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isSearchFocused && searchRecommendations.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                    className="absolute top-full left-0 right-0 mt-2 rounded-xl border p-2 z-50 glass" 
                    style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                    <p className="text-[10px] uppercase font-bold text-white/30 px-3 py-1 mb-1">Recommended</p>
                    {searchRecommendations.map((rec) => (
                      <Link key={rec.id} href={generateSlug(rec.id, rec.title)} className="block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className="text-sm font-medium text-white truncate">{rec.title}</div>
                        <div className="text-xs text-white/40">{rec.category}</div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Category filter */}
      <div className="sticky top-[56px] z-50 py-4 px-6 lg:px-10" style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid var(--nav-border)' }}>
        <div className="max-w-7xl mx-auto flex gap-2 overflow-visible pb-1 items-center relative">
          {topCategories.map((c: any) => (
            <button key={c} onClick={() => { setVisibleCount(12); handleCatChange(c); }}
              className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300"
              style={{ background: c === cat ? '#007AFF' : 'var(--bg-glass)', color: c === cat ? '#fff' : 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>
              {c}
            </button>
          ))}
          
          {overflowCategories.length > 0 && (
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300"
                style={{ background: overflowCategories.includes(cat) ? '#007AFF' : 'var(--bg-glass)', color: overflowCategories.includes(cat) ? '#fff' : 'var(--text-tertiary)', border: '1px solid var(--border-subtle)' }}>
                {overflowCategories.includes(cat) ? cat : 'More'} <ChevronDown className="w-3 h-3" />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-xl border p-2 z-50 shadow-2xl glass" 
                  style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}>
                  {overflowCategories.map((c: any) => (
                    <button key={c} onClick={() => { setVisibleCount(12); handleCatChange(c); setIsDropdownOpen(false); }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors"
                      style={{ color: c === cat ? '#007AFF' : 'var(--text-primary)', fontWeight: c === cat ? 600 : 400 }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <section className="py-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {cat === 'All' && !search && (
            <div className="mb-20">
              <p className="label-text mb-8">{content['blog_featured_label'] || 'Featured'}</p>
              <div className="grid md:grid-cols-2 gap-6">
                {featured.map((post, i) => <FeaturedPost key={post.id} post={{...post, content}} delay={i * 0.1} />)}
              </div>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-8">
              <p className="label-text">
                {search ? `Results for "${search}"` : cat === 'All' ? (content['blog_latest_label'] || 'Latest Articles') : cat}
                <span className="ml-3" style={{ color: 'var(--text-muted)' }}>({rest.length})</span>
              </p>
            </div>
            {paginatedRest.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {paginatedRest.map((post, i) => <PostCard key={post.id} post={{...post, content}} delay={(i % 12) * 0.07} />)}
                </div>
                {visibleCount < rest.length && (
                  <div className="mt-16 flex justify-center">
                    <button onClick={() => setVisibleCount(v => v + 12)} className="px-8 py-3 rounded-full text-sm font-bold text-white transition-all hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                      Load More Articles
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="glass rounded-2xl p-16 text-center">
                <Search className="w-8 h-8 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-tertiary)' }}>{content['blog_empty_state'] || 'No articles found for'} "{search}"</p>
                <button onClick={handleClearSearch} className="mt-4 text-[#007AFF] text-sm hover:underline">{content['blog_clear_search'] || 'Clear search'}</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#007AFF] animate-spin"></div></div>}>
      <BlogContent />
    </Suspense>
  );
}
