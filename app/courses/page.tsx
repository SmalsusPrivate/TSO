'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
  useMotionValue,
} from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Clock, GraduationCap, Layout, PlayCircle, Shield, Target, TrendingUp, Users, Code2, Cpu, FileJson, Layers, Database, Lock, Globe2, Briefcase, Rocket, Star, Check, ChevronDown, Play, X } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/utils';
import { useContent } from '@/components/ContentContext';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────────────────────────
   VIDEO SOURCES — Pexels free video CDN
   Each video is autoplay / muted / loop / playsInline for bg use
───────────────────────────────────────────────────────────────── */
const VIDEOS = {
  // Hero reel — coding workspace timelapse
  hero: 'https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4',
  // Python/programming — developer typing at dark terminal
  python: 'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
  // AI/ML — abstract data visualization / neural network
  ai: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4',
  // MERN / web dev — code on screen, browser workflow
  mern: 'https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_25fps.mp4',
  // React / frontend — UI design on monitor
  react: 'https://videos.pexels.com/video-files/3249283/3249283-uhd_2560_1440_25fps.mp4',
  // SharePoint / enterprise — office collaboration
  sharepoint: 'https://videos.pexels.com/video-files/3205567/3205567-uhd_2560_1440_25fps.mp4',
  // Spoken English — professional speaking, presentation
  english: 'https://videos.pexels.com/video-files/3253701/3253701-uhd_2560_1440_25fps.mp4',
  // Interview — professional meeting / handshake
  interview: 'https://videos.pexels.com/video-files/3044954/3044954-uhd_2560_1440_25fps.mp4',
  // Computer fundamentals — typing, basic computer use
  fundamentals: 'https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4',
};

/* ─────────────────────────────────────────────────────────────────
   COURSE DATA
───────────────────────────────────────────────────────────────── */
const fallbackCourses = [
  {
    no: '01', name: 'Python Programming',
    tagline: 'The language powering the future.',
    desc: 'From zero to production-ready Python developer. Build web applications, automate workflows, and lay the foundation for AI/ML development.',
    img: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: VIDEOS.python,
    color: '#007AFF', accent: '#4da6ff',
    duration: '2–3 Months', level: 'Beginner → Advanced', category: 'Programming',
    topics: ['Core Python & OOP', 'Django & Flask', 'REST APIs', 'SQL & NoSQL', 'Automation Scripts', 'Deployment'],
    careers: ['Python Developer', 'Backend Engineer', 'Automation Engineer', 'Data Analyst'],
    highlights: ['Beginner friendly — zero experience needed', 'Build 3 real-world projects', 'Industry expert trainers'],
    stat: { label: 'Students Placed', val: '80+' },
  },
  {
    no: '02', name: 'AI & Machine Learning',
    tagline: 'Build minds. Code intelligence.',
    desc: 'Master TensorFlow, Neural Networks, NLP, and Computer Vision. Deploy real ML models used in production at top tech companies.',
    img: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: VIDEOS.ai,
    color: '#34AADC', accent: '#6fcfff',
    duration: '3–4 Months', level: 'Intermediate', category: 'Data Science',
    topics: ['NumPy & Pandas', 'TensorFlow / Keras', 'Deep Learning', 'NLP & Computer Vision', 'Model Evaluation', 'Cloud Deploy'],
    careers: ['ML Engineer', 'Data Scientist', 'AI Researcher', 'Data Analyst'],
    highlights: ['Real industry datasets', '5 ML projects for portfolio', 'Cloud deployment training'],
    stat: { label: 'Avg. Salary', val: '₹6–18 LPA' },
  },
  {
    no: '03', name: 'MERN Stack',
    tagline: 'One stack. Full power.',
    desc: 'Become a complete full-stack developer with MongoDB, Express, React, and Node.js. Build and ship scalable web applications end-to-end.',
    img: 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: VIDEOS.mern,
    color: '#30D158', accent: '#70e88a',
    duration: '3 Months', level: 'Beginner → Expert', category: 'Full Stack',
    topics: ['MongoDB & Mongoose', 'Express.js', 'React & Redux', 'Node.js', 'JWT Auth', 'AWS / Vercel'],
    careers: ['Full Stack Developer', 'MERN Developer', 'Frontend Engineer', 'Backend Engineer'],
    highlights: ['Full e-commerce app project', 'Authentication & security', 'Deploy to production'],
    stat: { label: 'Hiring Partners', val: '40+' },
  },
  {
    no: '04', name: 'ReactJS',
    tagline: 'The UI layer. Mastered.',
    desc: 'Modern React with TypeScript, Next.js, Redux Toolkit, and performance optimization. Build the interfaces millions interact with daily.',
    img: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: VIDEOS.react,
    color: '#0AC8B9', accent: '#5ee8de',
    duration: '2 Months', level: 'Intermediate', category: 'Frontend',
    topics: ['React Hooks & Patterns', 'TypeScript', 'Next.js App Router', 'Redux Toolkit', 'Performance', 'Testing'],
    careers: ['React Developer', 'Frontend Engineer', 'UI Developer', 'Next.js Developer'],
    highlights: ['Production patterns & best practices', 'Portfolio of React apps', 'TypeScript throughout'],
    stat: { label: 'Completion Rate', val: '96%' },
  },
  {
    no: '05', name: 'SharePoint & Power Apps',
    tagline: 'Enterprise apps. Low code. High impact.',
    desc: 'Build mission-critical enterprise solutions with Microsoft 365 — SharePoint, Power Apps, Power Automate, and Teams integration.',
    img: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: VIDEOS.sharepoint,
    color: '#FF9F0A', accent: '#ffc75a',
    duration: '2 Months', level: 'Intermediate', category: 'Microsoft 365',
    topics: ['SharePoint Online', 'Power Apps Canvas', 'Power Automate', 'Teams Integration', 'Power BI', 'SPFx Dev'],
    careers: ['SharePoint Dev', 'Power Platform Dev', 'M365 Consultant', 'Business Analyst'],
    highlights: ['Microsoft cert prep included', 'High-demand enterprise skills', 'Real business app projects'],
    stat: { label: 'Salary Premium', val: '+35%' },
  },
  {
    no: '06', name: 'Spoken English',
    tagline: 'Speak. Lead. Succeed.',
    desc: 'Professional communication skills taught by corporate trainers. From grammar fundamentals to boardroom presentations and job interviews.',
    img: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: VIDEOS.english,
    color: '#FF2D55', accent: '#ff7a93',
    duration: '1–2 Months', level: 'All Levels', category: 'Communication',
    topics: ['Grammar & Vocabulary', 'Pronunciation', 'Group Discussions', 'Public Speaking', 'Business English', 'Mock Interviews'],
    careers: ['Any IT Role', 'Team Lead', 'Manager', 'Business Professional'],
    highlights: ['Ex-Wipro, Amazon, British Council trainers', 'Daily conversation practice', 'Mock GD & interview rounds'],
    stat: { label: 'Confidence Score', val: '4.9★' },
  },
  {
    no: '07', name: 'Interview Preparation',
    tagline: 'Get ready. Get hired.',
    desc: 'Crack any IT interview with DSA, system design, HR rounds, resume optimization, and offer negotiation mastery.',
    img: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: VIDEOS.interview,
    color: '#BF5AF2', accent: '#d98eff',
    duration: '1 Month', level: 'All Levels', category: 'Career',
    topics: ['DSA', 'System Design', 'Aptitude', 'Resume Writing', 'LinkedIn', 'HR Mastery'],
    careers: ['Software Developer', 'Any IT Role', 'Product Manager', 'Business Analyst'],
    highlights: ['Company-specific prep', '10+ mock interviews', 'Offer negotiation tips'],
    stat: { label: 'Offer Rate', val: '88%' },
  },
  {
    no: '08', name: 'Computer Fundamentals',
    tagline: 'Start here. Go anywhere.',
    desc: 'The perfect foundation for beginners. Master MS Office, internet essentials, basic programming concepts, and digital communication.',
    img: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1400',
    video: VIDEOS.fundamentals,
    color: '#636366', accent: '#a0a0a5',
    duration: '1 Month', level: 'Beginner', category: 'Basics',
    topics: ['MS Office Suite', 'Internet & Email', 'Basic Typing', 'Cloud Storage', 'Digital Comm.', 'Cybersecurity'],
    careers: ['Office Executive', 'Data Entry', 'Admin', 'Any Digital Role'],
    highlights: ['Zero prior knowledge needed', 'Practical daily exercises', 'Bridge to advanced courses'],
    stat: { label: 'Enrolled', val: '200+' },
  },
];

/* ─────────────────────────────────────────────────────────────────
   BG VIDEO — muted autoplay loop with fallback image
───────────────────────────────────────────────────────────────── */
function BgVideo({ src, fallback, opacity = 0.3, className = '' }: { src: string; fallback: string; opacity?: number; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => setFailed(true));
  }, []);

  if (failed || !src) {
    return <img src={resolveMediaUrl(fallback)} alt="" className={`absolute inset-0 w-full h-full object-cover ${className}`} style={{ opacity }} />;
  }

  return (
    <video
      ref={ref}
      src={resolveMediaUrl(src)}
      autoPlay
      muted
      loop
      playsInline
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      style={{ opacity }}
      onError={() => setFailed(true)}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   CINEMATIC HERO — full-screen video bg, scroll parallax
───────────────────────────────────────────────────────────────── */
function CinematicHero() {
  const content = useContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const vidScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Parallax video layer */}
      <motion.div style={{ scale: vidScale }} className="absolute inset-0 will-change-transform origin-center">
        <BgVideo
          src={VIDEOS.hero}
          fallback="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1800"
          opacity={0.22}
        />
      </motion.div>

      {/* Noise overlay for film grain feel */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px', opacity: 0.4 }} />

      {/* Radial vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(3,3,8,0.85) 100%)' }} />

      {/* Bottom fade to page */}
      <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }} />

      {/* Animated light streak */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute h-px"
          style={{ left: 0, right: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(0,122,255,0.5) 40%, rgba(52,170,220,0.3) 60%, transparent 100%)' }}
          animate={{ top: ['15%', '85%'], opacity: [0, 1, 0] }}
          transition={{ duration: 7, repeat: Infinity, repeatDelay: 5, ease: [0.4, 0, 0.6, 1] }}
        />
        <motion.div
          className="absolute w-px"
          style={{ top: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,199,190,0.3), transparent)' }}
          animate={{ left: ['20%', '80%'], opacity: [0, 1, 0] }}
          transition={{ duration: 9, repeat: Infinity, repeatDelay: 7, ease: 'linear', delay: 3 }}
        />
      </div>

      {/* Orbs */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 700, height: 400, top: '10%', left: '50%', x: '-50%', background: 'radial-gradient(ellipse, rgba(0,122,255,0.16), transparent 70%)', filter: 'blur(80px)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <motion.div style={{ opacity, y: textY }} className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24 pb-16">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="label-text text-[#007AFF] mb-8">
          {content['courses_hero_label'] || 'Training Programs'}
        </motion.p>

        <div className="overflow-hidden mb-2">
          <motion.h1
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.12, ease: EASE }}
            className="hero-text"
            style={{ color: 'var(--text-primary)' }}
          >
            {content['courses_hero_title1'] || 'Eight courses.'}
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-12">
          <motion.h1
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.26, ease: EASE }}
            className="hero-text text-gradient-blue"
          >
            {content['courses_hero_title2'] || 'One destination.'}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
          className="text-xl font-light max-w-xl mx-auto leading-relaxed mb-16"
          style={{ color: 'var(--text-secondary)' }}
        >
          {content['courses_hero_desc'] || 'From complete beginner to industry-ready engineer — every program is designed around one goal: getting you hired.'}
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: EASE }}
          className="flex items-center justify-center gap-8 sm:gap-14 flex-wrap"
        >
          {[
            { icon: Users, val: content['courses_hero_stat1_val'] || '500+', label: content['courses_hero_stat1_label'] || 'Students' },
            { icon: Layers, val: content['courses_hero_stat2_val'] || '8', label: content['courses_hero_stat2_label'] || 'Courses' },
            { icon: Star, val: content['courses_hero_stat3_val'] || '100%', label: content['courses_hero_stat3_label'] || 'Placement Support' },
            { icon: Clock, val: content['courses_hero_stat4_val'] || '1–4 Mo', label: content['courses_hero_stat4_label'] || 'Flexible Duration' },
          ].map(({ icon: Icon, val, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <Icon className="w-4 h-4" style={{ color: '#007AFF' }} />
              <span className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{val}</span>
              <span className="text-xs tracking-wide" style={{ color: 'var(--text-tertiary)' }}>{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="mt-20 flex flex-col items-center gap-1">
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>{content['courses_hero_scroll'] || 'Scroll to explore'}</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5 mt-1" style={{ color: 'var(--text-muted)' }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SECTION DIVIDER — animated light stripe between sections
───────────────────────────────────────────────────────────────── */
function SectionDivider({ color }: { color: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="relative h-px overflow-hidden mx-6 lg:mx-16" style={{ background: 'var(--border-subtle)' }}>
      <motion.div
        className="absolute inset-y-0 left-0 w-full h-full"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        initial={{ x: '-100%' }}
        animate={inView ? { x: '100%' } : {}}
        transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COURSE CARD — full-bleed video bg, cinematic reveal
───────────────────────────────────────────────────────────────── */
function CourseCard({
  course,
  index,
  observerRef,
}: {
  course: typeof fallbackCourses[0];
  index: number;
  observerRef?: (el: HTMLDivElement | null) => void;
}) {
  const content = useContent();
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: '-8%' });
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] });

  // Video parallax — zooms from 1.2 → 1 as card scrolls into view
  const vidScale = useTransform(scrollYProgress, [0, 0.4, 1], [1.22, 1, 0.95]);
  const vidOpacity = useTransform(scrollYProgress, [0, 0.15, 0.7, 1], [0, 0.32, 0.32, 0.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const [open, setOpen] = useState(false);

  return (
    <div ref={(el) => {
      (wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      if (observerRef) observerRef(el);
    }}>
      {/* Divider before each card (except first) */}
      {index > 0 && <SectionDivider color={course.color} />}

      {/* Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 70 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.0, delay: 0.04, ease: EASE }}
        className="relative rounded-3xl overflow-hidden group cursor-pointer"
        style={{
          minHeight: 500,
          marginTop: index > 0 ? 8 : 0,
          border: `1px solid ${course.color}1a`,
          background: '#07070e',
        }}
        onClick={() => setOpen(!open)}
      >
        {/* VIDEO background with parallax scale */}
        <motion.div
          style={{ scale: vidScale, opacity: vidOpacity }}
          className="absolute inset-0 will-change-transform origin-center"
        >
          <BgVideo src={course.video} fallback={course.img} opacity={1} />
        </motion.div>

        {/* Cinematic color grade overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${course.color}20 0%, transparent 45%, rgba(0,0,0,0.55) 100%)`,
          }}
        />
        {/* Bottom scrim — text readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(3,3,8,0.97) 0%, rgba(3,3,8,0.7) 30%, rgba(3,3,8,0.15) 60%, transparent 100%)' }}
        />

        {/* Noise grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 128 128' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }}
        />

        {/* Hover glowing border */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 1.5px ${course.color}55` }}
        />
        {/* Hover color bloom */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 90%, ${course.color}14, transparent)` }}
        />

        {/* Content */}
        <motion.div style={{ y: textY, minHeight: 500 }} className="relative z-10 flex flex-col h-full p-8 lg:p-12">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span
                className="text-[10px] font-black tracking-[0.18em] px-3 py-1.5 rounded-full"
                style={{ color: course.color, background: `${course.color}18`, border: `1px solid ${course.color}35` }}
              >
                {course.no}
              </span>
              <span
                className="text-[10px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full"
                style={{ color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                {course.category}
              </span>
            </div>

            {/* Stat */}
            <div className="text-right">
              <div className="text-xl font-black leading-none" style={{ color: course.color }}>{course.stat.val}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{course.stat.label}</div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom content */}
          <div className="mt-auto">
            <motion.p
              className="text-sm italic mb-2.5 font-light"
              style={{ color: `${course.accent}cc` }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 + index * 0.02 }}
            >
              {course.tagline}
            </motion.p>

            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-[3.25rem] font-black tracking-tight leading-none mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {course.name}
                </h2>
                <div className="flex items-center gap-4 text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{course.duration}</span>
                  <span style={{ color: 'rgba(255,255,255,0.18)' }}>·</span>
                  <span>{course.level}</span>
                </div>
              </div>

              <motion.div
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold cursor-pointer flex-shrink-0"
                style={{ color: course.color, background: `${course.color}15`, border: `1px solid ${course.color}35` }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>{open ? (content['courses_card_btn_close'] || 'Close') : (content['courses_card_btn_explore'] || 'Explore')}</span>
                <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.3 }}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Expandable detail panel */}
      <AnimatePresence>
        {open && <CourseDetailPanel key="panel" course={course} />}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   DETAIL PANEL — splits into video preview + info columns
───────────────────────────────────────────────────────────────── */
function CourseDetailPanel({ course }: { course: typeof fallbackCourses[0] }) {
  const content = useContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const vidRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    v.muted = muted;
  }, [muted]);

  return (
    <motion.div
      ref={ref}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.65, ease: EASE }}
      className="overflow-hidden"
    >
      <div
        className="rounded-b-3xl overflow-hidden mt-[-12px]"
        style={{
          background: `linear-gradient(160deg, ${course.color}09 0%, #08080f 60%)`,
          border: `1px solid ${course.color}1a`,
          borderTop: 'none',
        }}
      >
        <div className="grid lg:grid-cols-5">
          {/* Left: inline video preview with play controls */}
          <div className="lg:col-span-2 relative overflow-hidden" style={{ minHeight: 300 }}>
            <video
              ref={vidRef}
              src={course.video}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.75 }}
            />
            {/* Video overlay gradient */}
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${course.color}22, rgba(3,3,8,0.6))` }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, #08080f)' }} />

            {/* Sound toggle */}
            <button
              onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
              className="absolute bottom-4 left-4 flex items-center gap-2 text-xs px-3 py-2 rounded-full font-semibold backdrop-blur-md"
              style={{ color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <Play className="w-3 h-3" />
              {muted ? 'Unmute' : 'Mute'}
            </button>

            {/* Course name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-14">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25 }}
                className="text-2xl font-black leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {course.name}
              </motion.p>
              <p className="text-sm font-light mt-1" style={{ color: `${course.accent}cc` }}>{course.tagline}</p>
            </div>
          </div>

          {/* Right: info columns */}
          <div className="lg:col-span-3 grid sm:grid-cols-3 divide-x" style={{ '--tw-divide-opacity': 0.08, borderColor: `rgba(255,255,255,0.08)` } as React.CSSProperties}>
            {/* Topics */}
            <div className="p-6 lg:p-8">
              <p className="label-text text-[10px] mb-4" style={{ color: course.color }}>{content['courses_panel_learn_label'] || "What You'll Learn"}</p>
              <div className="space-y-2.5">
                {course.topics.map((t: string, i: number) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, x: -14 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.15 + i * 0.06, ease: EASE }}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${course.color}18`, border: `1px solid ${course.color}30` }}
                    >
                      <Check className="w-2 h-2" style={{ color: course.color }} />
                    </div>
                    {t}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 space-y-1.5">
                {course.highlights.map((h: string, i: number) => (
                  <motion.div
                    key={h}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-start gap-2 text-xs py-1.5"
                    style={{ color: 'rgba(255,255,255,0.38)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: course.color }} />
                    {h}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Careers */}
            <div className="p-6 lg:p-8">
              <p className="label-text text-[10px] mb-4" style={{ color: course.color }}>{content['courses_panel_outcomes_label'] || 'Career Outcomes'}</p>
              <div className="space-y-2">
                {course.careers.map((c: string, i: number) => (
                  <motion.div
                    key={c}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.07, ease: EASE }}
                    className="text-xs px-3 py-2 rounded-xl font-medium"
                    style={{ color: course.color, background: `${course.color}12`, border: `1px solid ${course.color}22` }}
                  >
                    {c}
                  </motion.div>
                ))}
              </div>

              {/* Stat */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.55 }}
                className="mt-6 p-4 rounded-2xl text-center"
                style={{ background: `${course.color}10`, border: `1px solid ${course.color}20` }}
              >
                <div className="text-3xl font-black" style={{ color: course.color }}>{course.stat.val}</div>
                <div className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{course.stat.label}</div>
              </motion.div>

              <div className="mt-4 space-y-2">
                {[
                  { label: content['courses_panel_duration'] || 'Duration', val: course.duration },
                  { label: content['courses_panel_level'] || 'Level', val: course.level },
                  { label: content['courses_panel_batches'] || 'Batches', val: content['courses_panel_batches_val'] || 'Morning / Evening / Weekend' },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-xs py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                    <span style={{ color: 'var(--text-tertiary)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 lg:p-8 flex flex-col justify-center gap-3">
              <p className="text-sm font-light mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {course.desc}
              </p>
              <motion.a
                href="https://wa.me/919560952733"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-bold text-sm"
                style={{ background: `linear-gradient(135deg, ${course.color}, ${course.accent})`, boxShadow: `0 6px 24px ${course.color}38` }}
              >
                {content['courses_panel_btn_enroll'] || 'Enroll Now'} <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="/contact"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.52 }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-sm"
                style={{ color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {content['courses_panel_btn_demo'] || 'Book Free Demo'}
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   COURSE SHOWCASE — stacked full-bleed cards
───────────────────────────────────────────────────────────────── */
function CourseShowcase({ courses }: { courses: any[] }) {
  const content = useContent();
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 pb-4">
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="label-text text-[#007AFF]">
          {content['courses_showcase_label'] || 'Explore All Courses'}
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-24 space-y-3">
        {courses.map((course, i) => (
          <CourseCard
            key={course.no}
            course={course}
            index={i}
            observerRef={(el) => { itemRefs.current[i] = el; }}
          />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   CINEMATIC INTERLUDE — fullscreen video storytelling strip
───────────────────────────────────────────────────────────────── */
function VideoInterlude() {
  const content = useContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1.1, 1, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const inView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ height: '65vh', background: 'var(--bg-primary)' }}>
      <motion.div style={{ scale }} className="absolute inset-0 will-change-transform">
        <BgVideo
          src={VIDEOS.python}
          fallback="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1800"
          opacity={0.28}
        />
      </motion.div>

      <motion.div style={{ opacity, background: 'linear-gradient(135deg, rgba(0,122,255,0.18), transparent 60%, rgba(52,170,220,0.1))' }} className="absolute inset-0" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(3,3,8,0.9) 100%)' }} />

      {/* Horizontal scan lines */}
      {[20, 45, 70].map((pct, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0 h-px"
          style={{ top: `${pct}%`, background: `linear-gradient(90deg, transparent, rgba(0,122,255,${0.15 - i * 0.04}), transparent)` }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 5 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 1.5 }}
        />
      ))}

      <motion.div
        style={{ y: textY, opacity }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="label-text text-[#007AFF] mb-5"
        >
          {content['courses_interlude_label'] || 'The TSO Difference'}
        </motion.p>
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: '100%' }}
            animate={inView ? { y: '0%' } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            className="section-text"
            style={{ color: 'var(--text-primary)' }}
          >
            {content['courses_interlude_title1'] || 'Learn by building.'}
          </motion.h2>
        </div>
        <div className="overflow-hidden mb-6">
          <motion.h2
            initial={{ y: '100%' }}
            animate={inView ? { y: '0%' } : {}}
            transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
            className="section-text text-gradient-blue"
          >
            {content['courses_interlude_title2'] || 'Graduate by shipping.'}
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45 }}
          className="text-lg font-light max-w-lg"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {content['courses_interlude_desc'] || 'Every course ends with production-ready projects that go straight into your portfolio and get you hired.'}
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ORBIT VISUAL — courses as orbiting nodes
───────────────────────────────────────────────────────────────── */
function OrbitVisual({ courses }: { courses: any[] }) {
  const content = useContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-28 overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[130px] pointer-events-none" style={{ background: 'rgba(0,122,255,0.09)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Orbit visualization */}
          <motion.div 
            className="relative flex items-center justify-center" 
            style={{ height: 420 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {/* Rings */}
            {[120, 175, 200].map((r, ri) => (
              <div key={r} className="absolute rounded-full pointer-events-none" style={{ width: r * 2, height: r * 2, border: `1px solid rgba(0,122,255,${0.12 - ri * 0.03})` }} />
            ))}

            {/* Center core */}
            <motion.div
              className="relative z-10 w-28 h-28 rounded-2xl flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #007AFF, #0055CC)', boxShadow: '0 0 60px rgba(0,122,255,0.45)' }}
              animate={{ boxShadow: ['0 0 40px rgba(0,122,255,0.35)', '0 0 80px rgba(0,122,255,0.55)', '0 0 40px rgba(0,122,255,0.35)'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="flex flex-col items-center">
                <span className="text-xl font-black text-white">TSO</span>
                <span className="text-[9px] font-semibold text-white/60 tracking-widest">ORBIT</span>
              </motion.div>
            </motion.div>

            {/* Course dots */}
            {courses.map((c, i) => {
              const angle = (i / courses.length) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const r = i % 2 === 0 ? 120 : 175;
              const cx = Math.cos(rad) * r;
              const cy = Math.sin(rad) * r;
              return (
                <motion.div
                  key={c.no}
                  className="absolute flex items-center justify-center rounded-xl text-[9px] font-black cursor-default"
                  style={{ width: 46, height: 46, background: `linear-gradient(135deg, ${c.color}, ${c.accent})`, left: '50%', top: '50%', x: cx - 23, y: cy - 23, boxShadow: `0 4px 20px ${c.color}50` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 260, damping: 18 }}
                  title={c.name}
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 6, -6, 0] }}
                      transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                      className="text-white"
                    >
                      {c.no}
                    </motion.div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Text */}
          <div>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="label-text text-[#007AFF] mb-5">
              {content['courses_orbit_label'] || 'The TSO Universe'}
            </motion.p>
            <div className="overflow-hidden mb-2">
              <motion.h2
                initial={{ y: '100%', opacity: 0 }}
                animate={inView ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 0.9, ease: EASE }}
                className="section-text"
                style={{ color: 'var(--text-primary)' }}
              >
                {content['courses_orbit_title1'] || 'Every course'}
              </motion.h2>
            </div>
            <div className="overflow-hidden mb-7">
              <motion.h2
                initial={{ y: '100%', opacity: 0 }}
                animate={inView ? { y: '0%', opacity: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.12, ease: EASE }}
                className="section-text text-gradient-blue"
              >
                {content['courses_orbit_title2'] || 'orbits one goal.'}
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-lg font-light leading-relaxed mb-10"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {content['courses_orbit_desc'] || 'Whether Python, AI, MERN, or communication — every program connects to the same outcome: a job you are proud of.'}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.45 }}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-sm hover:scale-[1.04] transition-transform duration-300"
                style={{ background: 'linear-gradient(135deg, #007AFF, #0055CC)', boxShadow: '0 6px 24px rgba(0,122,255,0.38)' }}
              >
                {content['courses_orbit_btn'] || 'Start Your Journey'} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   WHY TSO — comparison strip
───────────────────────────────────────────────────────────────── */
function WhyTSO({ features }: { features: any[] }) {
  const content = useContent();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  const fallbackRows = [
    { label: 'Placement Support', tso: true, others: false },
    { label: 'Industry Trainers', tso: true, others: false },
    { label: 'Real Project Work', tso: true, others: false },
    { label: 'Mock Interviews', tso: true, others: false },
    { label: 'Flexible Batches', tso: true, others: true },
    { label: 'Resume Building', tso: true, others: false },
  ];

  const rows = features && features.length > 0 ? features : fallbackRows;

  return (
    <section ref={ref} className="relative py-32 overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 bg-grid-fine" style={{ opacity: 0.5 }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full blur-[150px]" style={{ background: 'rgba(0,122,255,0.08)' }} />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="label-text text-[#007AFF] mb-4">{content['courses_why_label'] || 'Why TSO?'}</motion.p>
          <div className="overflow-hidden">
            <motion.h2 initial={{ y: '100%', opacity: 0 }} animate={inView ? { y: '0%', opacity: 1 } : {}} transition={{ duration: 0.9, ease: EASE }} className="section-text" style={{ color: 'var(--text-primary)' }}>
              {content['courses_why_title'] || 'The difference is real.'}
            </motion.h2>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="rounded-3xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(30px)' }}
        >
          <div className="grid grid-cols-3 text-center py-5 px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
            <span className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>{content['courses_why_col1'] || 'Feature'}</span>
            <span className="text-sm font-bold" style={{ color: '#007AFF' }}>{content['courses_why_col2'] || 'TSO'}</span>
            <span className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.3)' }}>{content['courses_why_col3'] || 'Others'}</span>
          </div>
          {rows.map(({ label, tso, others }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -18 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.07, ease: EASE }}
              className="grid grid-cols-3 text-center py-4 px-6 items-center"
              style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
            >
              <span className="text-sm text-left font-light" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
              <span className="font-bold" style={{ color: '#30D158', fontSize: 18 }}>✓</span>
              <span className="text-sm font-semibold" style={{ color: others ? '#30D158' : 'rgba(255,255,255,0.2)' }}>{others ? '✓' : '—'}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FINAL CTA — full-screen video backdrop
───────────────────────────────────────────────────────────────── */
function FinalCTA() {
  const content = useContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const vidScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const op = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section ref={ref} className="relative py-44 overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Parallax BG video */}
      <motion.div style={{ scale: vidScale }} className="absolute inset-0 will-change-transform">
        <BgVideo
          src={VIDEOS.interview}
          fallback="https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1800"
          opacity={0.16}
        />
      </motion.div>

      <div className="absolute inset-0 bg-cinematic" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[160px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(0,122,255,0.22), transparent 70%)' }} />

      <motion.div style={{ scale, opacity: op }} className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="label-text text-[#007AFF] mb-10">
          {content['courses_cta_label'] || 'Not Sure Where to Start?'}
        </motion.p>
        <div className="overflow-hidden mb-4">
          <motion.div initial={{ y: '100%', opacity: 0 }} animate={inView ? { y: '0%', opacity: 1 } : {}} transition={{ duration: 1, ease: EASE }} className="section-text" style={{ color: 'var(--text-primary)' }}>
            {content['courses_cta_title'] || 'Let us guide you.'}
          </motion.div>
        </div>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35 }} className="text-xl font-light max-w-lg mx-auto mb-14 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          {content['courses_cta_desc'] || 'Book a free counselling session and our experts will map the perfect learning path to your dream job.'}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="https://wa.me/919560952733"
            target="_blank"
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-full text-white font-bold text-lg hover:opacity-90 transition-all duration-300 hover:scale-[1.04]"
            style={{ background: 'linear-gradient(135deg, #007AFF, #0055CC)', boxShadow: '0 8px 32px rgba(0,122,255,0.42)' }}
          >
            {content['courses_cta_btn1'] || 'Book Free Counselling'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-[1.02]"
            style={{ color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
          >
            {content['courses_cta_btn2'] || 'Contact Us'}
          </Link>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }} className="mt-8 text-sm" style={{ color: 'rgba(255,255,255,0.22)' }}>
          Tech Zone 4, Greater Noida West · tsogreaternoida@gmail.com
        </motion.p>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/features`).then(res => res.json()).catch(() => ({ status: 'error' }))
    ]).then(([coursesData, featuresData]) => {
      if (coursesData && coursesData.status === 'success') {
        const parsed = coursesData.data.map((c: any) => ({
          ...c,
          topics: typeof c.topics === 'string' ? JSON.parse(c.topics) : c.topics,
          careers: typeof c.careers === 'string' ? JSON.parse(c.careers) : c.careers,
          highlights: typeof c.highlights === 'string' ? JSON.parse(c.highlights) : c.highlights,
          stat: { label: c.stat_label, val: c.stat_val },
          desc: c.description
        }));
        setCourses(parsed);
      }
      if (featuresData && featuresData.status === 'success') {
        setFeatures(featuresData.data);
      }
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]"><div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#007AFF] animate-spin"></div></div>;
  }

  return (
    <>
      <CinematicHero />
      <CourseShowcase courses={courses.length ? courses : fallbackCourses} />
      <VideoInterlude />
      <OrbitVisual courses={courses.length ? courses : fallbackCourses} />
      <WhyTSO features={features} />
      <FinalCTA />
    </>
  );
}
