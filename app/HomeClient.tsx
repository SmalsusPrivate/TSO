'use client';

import { ArrowRight, Star, ChevronDown, Zap, Users, Trophy, BookOpen, Code2, Globe2, LineChart, Briefcase, Database, Palette, Shield, Rocket } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useContent } from '@/components/ContentContext';
import { resolveMediaUrl } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Particles ──────────────────────────────────────────────── */
function Particles({ count = 35 }: { count?: number }) {
  const pts = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 8,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background: p.id % 3 === 0 ? '#007AFF' : p.id % 3 === 1 ? '#34AADC' : '#0AC8B9',
          }}
          animate={{ y: [0, -30, 0], opacity: [p.opacity, p.opacity * 2.5, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─── Animated counter ───────────────────────────────────────── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 50;
    const inc = target / steps;
    const t = setInterval(() => {
      start += inc;
      if (start >= target) { setCount(target); clearInterval(t); return; }
      setCount(Math.round(start));
    }, 30);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── FadeUp utility ─────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '', once = true }: { children: React.ReactNode; delay?: number; className?: string; once?: boolean }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-8%' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════ */
function Hero() {
  const content = useContent();
  const { scrollY } = useScroll();
  const bgY      = useTransform(scrollY, [0, 700], [0, 120]);
  const bgScale  = useTransform(scrollY, [0, 700], [1, 1.08]);
  const textY    = useTransform(scrollY, [0, 500], [0, 90]);
  const textOp   = useTransform(scrollY, [0, 400], [1, 0]);

  const words = (content['home_hero_words'] || 'Python,AI & ML,MERN Stack,ReactJS,SharePoint').split(',');
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % words.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* BG layer */}
      <motion.div style={{ scale: bgScale, y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-cinematic" />
        <div className="absolute inset-0 bg-grid" />
        {/* Large glow orb */}
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(ellipse, rgba(0,122,255,0.22) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(ellipse, rgba(52,170,220,0.12) 0%, transparent 70%)' }}
        />
      </motion.div>

      {/* Animated scan line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,122,255,0.5), transparent)' }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
        />
      </div>

      <Particles count={40} />

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity: textOp }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center pt-28 pb-20"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-14 text-xs font-semibold tracking-[0.1em] uppercase"
          style={{
            background: 'rgba(0,122,255,0.1)',
            border: '1px solid rgba(0,122,255,0.25)',
            color: 'rgba(120,180,255,0.9)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#30D158] flex-shrink-0" style={{ boxShadow: '0 0 8px #30D158' }} />
          {content['home_hero_badge'] || "Greater Noida's Premier IT Training Institute"}
          <span className="opacity-60 text-[10px]">{content['home_hero_badge_year'] || 'Est. 2020'}</span>
        </motion.div>

        {/* Main headline */}
        <div className="mb-8">
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
              className="display-text"
              style={{ color: 'var(--text-primary)' }}
            >
              {content['home_hero_title'] || 'Master'}
            </motion.div>
          </div>

          <div style={{ minHeight: '1.1em', overflow: 'visible', position: 'relative' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ y: 60, opacity: 0, filter: 'blur(8px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -60, opacity: 0, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: EASE }}
                className="display-text text-gradient-blue"
                style={{ lineHeight: 1.0, paddingBottom: '0.05em' }}
              >
                {words[idx]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
          className="text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed font-light mb-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          {content['home_hero_subtitle'] || 'Hands-on coding. Industry mentors. Real projects.'}<br />
          <span style={{ color: 'var(--text-tertiary)' }}>{content['home_hero_subtitle2'] || '100% placement support — Greater Noida.'}</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="https://api.whatsapp.com/send/?phone=919560952733&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-3 px-9 py-4 rounded-full text-white font-bold text-[15px] overflow-hidden transition-all duration-300 hover:scale-[1.04]"
            style={{ background: 'linear-gradient(135deg, #007AFF, #0055CC)', boxShadow: '0 4px 24px rgba(0,122,255,0.45), 0 1px 0 rgba(255,255,255,0.15) inset' }}
          >
            <span className="relative z-10">Book Free Demo Class</span>
            <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', backgroundSize: '200% 100%' }} />
          </a>

          <Link
            href="/courses"
            className="group flex items-center gap-3 px-9 py-4 rounded-full font-semibold text-[15px] transition-all duration-300 hover:scale-[1.02]"
            style={{
              color: 'var(--text-primary)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-medium)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {content['home_hero_cta_secondary'] || 'Explore Courses'}
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </motion.div>

        {/* Stats ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="flex items-center justify-center flex-wrap gap-x-8 gap-y-3"
        >
          {[
            { icon: Users,   label: `${content['home_stat_1_num'] || '500'}${content['home_stat_1_sfx'] || '+'} ${content['home_stat_1_label'] || 'Students Trained'}` },
            { icon: BookOpen, label: `${content['home_stat_2_num'] || '10'}${content['home_stat_2_sfx'] || '+'} ${content['home_stat_2_label'] || 'Expert Courses'}` },
            { icon: Trophy,  label: `${content['home_stat_3_num'] || '100'}${content['home_stat_3_sfx'] || '%'} ${content['home_stat_3_label'] || 'Placement Support'}` },
            { icon: Zap,     label: `${content['home_stat_4_label'] || 'Expert Trainers'}` },
          ].map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {i > 0 && <span className="w-px h-4" style={{ background: 'var(--border-subtle)' }} />}
              <Icon className="w-3.5 h-3.5" style={{ color: '#007AFF' }} />
              {label}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'var(--text-muted)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: '1.5px solid var(--border-medium)' }}
        >
          <div className="w-1 h-1.5 rounded-full bg-[#007AFF]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MARQUEE LOGOS STRIP
═══════════════════════════════════════════════════════════════ */
function TrustStrip() {
  const content = useContent();
  const companies = (content['home_trust_companies'] || 'Google, Amazon, Microsoft, Wipro, Infosys, TCS, HCL, Cognizant, Accenture, IBM').split(',').map(s => s.trim());
  return (
    <div
      className="relative py-5 overflow-hidden"
      style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
    >
      <div className="text-center mb-3">
        <span className="label-text text-[9px]" style={{ color: 'var(--text-muted)' }}>{content['home_trust_label'] || 'Our students work at'}</span>
      </div>
      <div className="flex overflow-hidden">
        <motion.div
          className="flex gap-12 items-center flex-shrink-0 pr-12"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {[...companies, ...companies].map((c, i) => (
            <span
              key={i}
              className="text-sm font-bold tracking-wide flex-shrink-0"
              style={{ color: 'var(--text-muted)' }}
            >
              {c}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STATEMENT
═══════════════════════════════════════════════════════════════ */
function Statement() {
  const content = useContent();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y  = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const op = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section ref={ref} className="relative py-40 overflow-hidden">
      <div className="absolute inset-0 bg-grid-fine" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: 'var(--orb-1)', opacity: 0.6 }}
      />
      <motion.div style={{ opacity: op }} className="relative z-10">
        <motion.div style={{ y }} className="max-w-5xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="label-text text-[#007AFF] mb-10"
          >
            {content['home_philosophy_label'] || 'Our Philosophy'}
          </motion.p>

          <h2 className="section-text leading-[1.05] mb-8" style={{ color: 'var(--text-primary)' }}>
            {(content['home_philosophy_headline'] || "We don't just teach technology — we build careers.").split(' ').map((line, li) => (
              <div key={li} className="overflow-hidden inline-block mr-2">
                <motion.span
                  className={`block ${li === 1 ? 'text-gradient-blue' : ''}`}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={inView ? { y: '0%', opacity: 1 } : {}}
                  transition={{ duration: 0.85, delay: li * 0.12, ease: EASE }}
                >
                  {line}
                </motion.span>
              </div>
            ))}
          </h2>

          <FadeUp delay={0.6}>
            <p
              className="text-xl max-w-2xl mx-auto font-light leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {content['home_philosophy_desc'] || "At Tech Zone 4, Greater Noida West — we've built an ecosystem where aspiring professionals transform into industry-ready engineers."}
            </p>
          </FadeUp>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════════════════════ */
function Stats() {
  const content = useContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });

  const stats = [
    { n: parseInt(content['home_stat_1_num'] || '500'), s: content['home_stat_1_sfx'] || '+', label: content['home_stat_1_label'] || 'Students Trained',   sub: content['home_stat_1_sub'] || 'Across all programs',        color: '#007AFF' },
    { n: parseInt(content['home_stat_2_num'] || '10'),  s: content['home_stat_2_sfx'] || '+', label: content['home_stat_2_label'] || 'Expert Courses',      sub: content['home_stat_2_sub'] || 'Industry-aligned curriculum', color: '#30D158' },
    { n: parseInt(content['home_stat_3_num'] || '100'), s: content['home_stat_3_sfx'] || '%', label: content['home_stat_3_label'] || 'Placement Support',   sub: content['home_stat_3_sub'] || 'Dedicated career team',       color: '#FF9F0A' },
    { n: parseInt(content['home_stat_4_num'] || '4'),   s: content['home_stat_4_sfx'] || '+', label: content['home_stat_4_label'] || 'Industry Trainers',   sub: content['home_stat_4_sub'] || 'Corporate experience',        color: '#FF2D55' },
  ];

  return (
    <section ref={ref} className="relative">
      <div
        className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4"
        style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        {stats.map(({ n, s, label, sub, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            className="relative px-8 py-14 text-center group"
            style={{
              borderRight: i < 3 ? '1px solid var(--border-subtle)' : 'none',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-none pointer-events-none"
              style={{ background: `radial-gradient(ellipse at center, ${color}08 0%, transparent 70%)` }}
            />
            <div
              className="text-5xl sm:text-6xl font-black tracking-tight mb-2"
              style={{ color }}
            >
              <AnimatedNumber target={n} suffix={s} />
            </div>
            <div className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{label}</div>
            <div className="text-xs font-light" style={{ color: 'var(--text-tertiary)' }}>{sub}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ECOSYSTEM
═══════════════════════════════════════════════════════════════ */
function Ecosystem() {
  const content = useContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  const items = [
    { n: '01', title: content['home_eco_1_title'] || 'Expert-Led Training',    desc: content['home_eco_1_desc'] || 'Learn from trainers with 10+ years at Wipro, Amazon, Infosys, and the British Council.',          color: '#007AFF' },
    { n: '02', title: content['home_eco_2_title'] || 'Hands-on Coding Labs',   desc: content['home_eco_2_desc'] || 'Every concept applied immediately — live coding sessions and real industry-grade projects.',       color: '#30D158' },
    { n: '03', title: content['home_eco_3_title'] || 'Flexible Batches',        desc: content['home_eco_3_desc'] || 'Morning, evening, and weekend batches. Learn at your pace without disrupting life.',               color: '#FF9F0A' },
    { n: '04', title: content['home_eco_4_title'] || 'Placement Ecosystem',    desc: content['home_eco_4_desc'] || 'Resume building, mock interviews, LinkedIn optimization, and direct referrals to hiring partners.', color: '#FF2D55' },
  ];

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-fine" />
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'var(--orb-2)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-20">
          <FadeUp>
            <p className="label-text text-[#007AFF] mb-5">{content['home_eco_label'] || 'Why TSO'}</p>
          </FadeUp>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%', opacity: 0 }}
              animate={inView ? { y: '0%', opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="section-text max-w-2xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {content['home_eco_headline'] || 'A complete ecosystem. Not just a class.'}
            </motion.h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {items.map(({ n, title, desc, color }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative p-8 rounded-2xl overflow-hidden"
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div
                className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: color }}
              />
              <div className="relative z-10">
                <div
                  className="label-text text-[10px] inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full"
                  style={{ color, background: `${color}15`, border: `1px solid ${color}25` }}
                >
                  {n}
                </div>
                <h3
                  className="font-bold text-2xl mb-4 tracking-tight transition-colors duration-300 group-hover:text-[#007AFF]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {title}
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COURSES
═══════════════════════════════════════════════════════════════ */
function Courses() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  const [apiCourses, setApiCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setApiCourses(data.data.slice(0, 6)); 
        }
      })
      .catch(err => console.error('Error fetching courses:', err));
  }, []);

  const fallbackCourses = [
    { no: '01', name: 'Python Programming',     tagline: 'The language of AI & automation.',    dur: '2–3 Mo', color: '#007AFF', img: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { no: '02', name: 'AI & Machine Learning',  tagline: 'Build intelligent applications.',     dur: '3–4 Mo', color: '#34AADC', img: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { no: '03', name: 'MERN Stack',             tagline: 'Full-stack mastery. One stack.',      dur: '3 Mo',   color: '#30D158', img: 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { no: '04', name: 'ReactJS',                tagline: 'The UI that powers the web.',         dur: '2 Mo',   color: '#0AC8B9', img: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { no: '05', name: 'SharePoint & Power Apps',tagline: 'Microsoft 365 enterprise power.',     dur: '2 Mo',   color: '#FF9F0A', img: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=900' },
    { no: '06', name: 'Spoken English',         tagline: 'Speak with confidence.',              dur: '1–2 Mo', color: '#FF2D55', img: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=900' },
  ];

  const courses = apiCourses.length > 0 ? apiCourses : fallbackCourses;

  return (
    <section ref={ref} className="relative py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <div>
            <FadeUp><p className="label-text text-[#007AFF] mb-4">Training Programs</p></FadeUp>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: '100%', opacity: 0 }}
                animate={inView ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                className="section-text"
                style={{ color: 'var(--text-primary)' }}
              >
                Six paths.<br /><span className="text-gradient-blue">One orbit.</span>
              </motion.h2>
            </div>
          </div>
          <FadeUp delay={0.2}>
            <Link
              href="/courses"
              className="hidden md:flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-[1.03]"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-medium)', background: 'var(--bg-glass)' }}
            >
              View All 8 Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c, i) => (
            <motion.div
              key={c.no}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: i * 0.08, ease: EASE }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ minHeight: 320, border: `1px solid ${c.color}20` }}
            >
              <div className="absolute inset-0 overflow-hidden">
                <motion.img
                  src={resolveMediaUrl(c.img)}
                  alt={c.name}
                  className="w-full h-full object-cover"
                  style={{ opacity: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                />
              </div>

              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom right, ${c.color}18, transparent 50%, black/40)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: `inset 0 0 0 1px ${c.color}40` }}
              />

              <div className="relative z-10 h-full flex flex-col justify-end p-7" style={{ minHeight: 320 }}>
                <div className="mb-auto pt-5">
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
                    style={{ color: c.color, background: `${c.color}18`, border: `1px solid ${c.color}30` }}
                  >
                    {c.no}
                  </span>
                </div>

                <div>
                  <p className="text-xs italic mb-1.5 font-light" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {c.tagline}
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight leading-tight">
                    {c.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {c.dur}
                    </span>
                    <a
                      href="https://api.whatsapp.com/send/?phone=919560952733&text&type=phone_number&app_absent=0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto relative z-50 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white transition-all duration-300 hover:scale-105"
                      style={{ background: c.color }}
                    >
                      <span>Enroll</span> 
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <FadeUp delay={0.3} className="mt-10 text-center md:hidden">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.03]"
            style={{ color: 'var(--text-primary)', border: '1px solid var(--border-medium)', background: 'var(--bg-glass)' }}
          >
            View All 8 Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TRAINERS
═══════════════════════════════════════════════════════════════ */
function Trainers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  const [trainers, setTrainers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainers`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const active = data.data.filter((t: any) => t.isActive !== false);
          const featured = active.filter((t: any) => t.isFeatured);
          const others = active.filter((t: any) => !t.isFeatured);
          setTrainers([...featured, ...others].slice(0, 4));
        }
      })
      .catch(err => console.error('Error fetching trainers:', err));
  }, []);

  const displayTrainers = trainers.length > 0 ? trainers : [
    { name: 'Vicky Singh',    role: 'Spoken English',       exp: '11 yrs', past: 'Wipro · HCL',         color: '#007AFF', img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Rahul Verma',    role: 'Communication',        exp: '4 yrs',  past: 'Amazon India',         color: '#34AADC', img: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Priya Deshmukh', role: 'Personality Dev.',     exp: '5 yrs',  past: 'British Council',      color: '#FF2D55', img: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Arjun Nair',     role: 'Soft Skills',          exp: '13 yrs', past: 'Infosys · TCS',        color: '#30D158', img: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=300' },
  ];

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-fine" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-20">
          <FadeUp><p className="label-text text-[#007AFF] mb-4">The Faculty</p></FadeUp>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%', opacity: 0 }}
              animate={inView ? { y: '0%', opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="section-text max-w-xl"
              style={{ color: 'var(--text-primary)' }}
            >
              Trained by the best.
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {displayTrainers.map(({ name, role, exp, past, img, color }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative p-6 rounded-2xl overflow-hidden"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(20px)' }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${color}08, transparent)` }}
              />
              <div className="relative z-10">
                <div className="relative mb-5 w-16 h-16">
                  <img src={resolveMediaUrl(img)} alt={name} className="w-16 h-16 rounded-2xl object-cover" />
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex-shrink-0"
                    style={{ background: color, borderColor: 'var(--bg-primary)' }}
                  />
                </div>
                <div className="font-bold text-base leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>{name}</div>
                <div className="text-xs font-semibold mb-2" style={{ color }}>{role}</div>
                <div className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>{past}</div>
                <div className="label-text text-[9px] mt-2">{exp} exp.</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TESTIMONIALS
═══════════════════════════════════════════════════════════════ */
function Testimonials() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setItems(data.data);
        }
      })
      .catch(err => console.error('Error fetching testimonials:', err));
  }, []);

  const fallbackItems = [
    { name: 'Vivek Kumar',     role: 'College Student',       text: 'I never thought learning computers and spoken English could be this fun. The step-by-step guidance made all the difference. Highly recommend TSO.', rating: 5 },
    { name: 'Rahul Chaudhary', role: 'Network Engineer',      text: 'The personalized attention and well-structured curriculum at TSO greatly boosted my confidence. Truly a game-changer for my career.', rating: 5 },
    { name: 'Ridhi Bhargav',   role: 'Marketing Executive',   text: 'These classes are a great combination! Improved my computer skills and spoken English, boosting confidence in the workplace.', rating: 5 },
    { name: 'Shubham Sharma',  role: 'Job Seeker',            text: 'Learning both computers and spoken English in one place is so convenient. The interactive sessions and helpful trainers made it enjoyable.', rating: 5 },
    { name: 'Divya Verma',     role: 'Student',               text: 'These classes changed my life! I learned essential computer skills and improved my spoken English with ease — perfect for beginners.', rating: 5 },
  ];

  const displayItems = items.length > 0 ? items : fallbackItems;
  const currentItem = displayItems[active] || displayItems[0];

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % displayItems.length), 4800);
    return () => clearInterval(t);
  }, [displayItems.length]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[130px] pointer-events-none"
        style={{ background: 'var(--orb-1)', opacity: 0.5 }}
      />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <FadeUp><p className="label-text text-[#007AFF] mb-4">Student Voices</p></FadeUp>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: '100%', opacity: 0 }}
              animate={inView ? { y: '0%', opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
              className="section-text"
              style={{ color: 'var(--text-primary)' }}
            >
              Their words. Their success.
            </motion.h2>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative rounded-3xl p-10 sm:p-14 text-center mb-8"
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-subtle)',
              backdropFilter: 'blur(30px)',
            }}
          >
            <div
              className="absolute top-8 left-10 text-8xl font-black leading-none select-none pointer-events-none"
              style={{ color: 'rgba(0,122,255,0.1)' }}
            >
              "
            </div>

            <div className="flex justify-center gap-1 mb-8">
              {Array.from({ length: currentItem.rating || 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#F5A623] text-[#F5A623]" />
              ))}
            </div>
            <p
              className="text-xl sm:text-2xl leading-relaxed font-light italic mb-10 relative z-10"
              style={{ color: 'var(--text-secondary)' }}
            >
              "{currentItem.text}"
            </p>
            <div>
              <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{currentItem.name}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>{currentItem.role}</div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2">
          {displayItems.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              animate={{
                width: i === active ? 32 : 8,
                background: i === active ? '#007AFF' : 'var(--border-medium)',
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FINAL CTA
═══════════════════════════════════════════════════════════════ */
function FinalCTA() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-40 overflow-hidden">
      <div className="absolute inset-0 bg-cinematic" />
      <div className="absolute inset-0 bg-grid" />
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full blur-[180px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,122,255,0.28) 0%, transparent 70%)' }}
      />
      <Particles count={25} />

      <motion.div style={{ scale, opacity }} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="label-text text-[#007AFF] mb-10"
        >
          Begin Your Journey
        </motion.p>

        <div className="overflow-hidden mb-4">
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
            className="display-text"
            style={{ color: 'var(--text-primary)' }}
          >
            Your orbit
          </motion.div>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.22, ease: EASE }}
            className="display-text text-gradient-blue"
          >
            begins now.
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="text-xl font-light max-w-lg mx-auto mb-14 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Book your free demo class today. No commitment — just clarity about your next step.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://api.whatsapp.com/send/?phone=919560952733&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-10 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 hover:scale-[1.04]"
            style={{ background: 'linear-gradient(135deg, #007AFF, #0055CC)', boxShadow: '0 8px 32px rgba(0,122,255,0.45)' }}
          >
            Book Free Demo Class
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
          <Link
            href="tel:+919560952733"
            className="flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-[1.02]"
            style={{ color: 'var(--text-primary)', border: '1px solid var(--border-medium)', background: 'var(--bg-glass)', backdropFilter: 'blur(20px)' }}
          >
            +91 9560 952733
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="mt-8 text-sm"
          style={{ color: 'var(--text-muted)' }}
        >
          Tech Zone 4, Greater Noida West · tsogreaternoida@gmail.com
        </motion.p>
      </motion.div>
    </section>
  );
}

export default function HomeClient({ content }: { content: Record<string, string> }) {
  return (
    <div className="contents">
      <Hero />
      <TrustStrip />
      <Statement />
      <Stats />
      <Ecosystem />
      <Courses />
      <Trainers />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}
