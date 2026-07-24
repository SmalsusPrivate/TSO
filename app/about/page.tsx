'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { resolveMediaUrl } from '@/lib/utils';
import { useContent } from '@/components/ContentContext';

const EASE_AVP = [0.16, 1, 0.3, 1] as const;

function Particles({ count = 30 }: { count?: number }) {
  const pts = useRef(Array.from({ length: count }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.3 + 0.08, dur: Math.random() * 9 + 5, delay: Math.random() * 4 })));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.current.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-blue-400" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
          animate={{ y: [0, -24, 0], opacity: [p.opacity, p.opacity * 2, p.opacity] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}

function LineReveal({ children, delay = 0, inView, className = '' }: { children: React.ReactNode; delay?: number; inView: boolean; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div initial={{ y: '105%', opacity: 0 }} animate={inView ? { y: '0%', opacity: 1 } : {}} transition={{ duration: 0.8, delay, ease: EASE_AVP }}>
        {children}
      </motion.div>
    </div>
  );
}

export default function AboutPage() {
  const content = useContent();

  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroScroll, [0, 1], [0, 120]);
  const heroOp = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const storyRef = useRef(null);
  const inViewStory = useInView(storyRef, { once: true, margin: '-10%' });
  const mvRef = useRef(null);
  const inViewMV = useInView(mvRef, { once: true, margin: '-10%' });
  const methodRef = useRef(null);
  const inViewMethod = useInView(methodRef, { once: true, margin: '-10%' });
  const trainersRef = useRef(null);
  const inViewTrainers = useInView(trainersRef, { once: true, margin: '-10%' });

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
    { name: 'Vicky Singh',    role: 'Senior Spoken English Trainer', exp: '11 Years', past: 'Wipro · HCL',          cert: 'TESOL Certified (USA)',              color: '#007AFF', bio: 'Specialized in grammar, fluency building, and interview preparation. Coached thousands of working professionals in corporate communication.', img: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Rahul Verma',    role: 'Communication & Soft Skills',    exp: '4 Years',  past: 'Amazon India',          cert: 'Public Speaking Coach',              color: '#34AADC', bio: 'Helped over 1,000 learners become confident in spoken English through practical and interactive training methodology.',                     img: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Priya Deshmukh', role: 'English & Personality Dev.',     exp: '5 Years',  past: 'British Council India', cert: 'Personality Dev. Certified',         color: '#FF2D55', bio: 'Former communication trainer with the British Council. Specializes in group discussions, public speaking, and personality development.',     img: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Arjun Nair',     role: 'Soft Skills & Spoken English',   exp: '13 Years', past: 'Infosys · TCS',         cert: 'Certified Soft Skills Trainer',      color: '#30D158', bio: 'Communication Coach for Infosys and TCS learning programs. Trained over 500 learners in workshops across India.',                           img: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  const methodSteps = [
    { no: '01', title: content['about_method_1_title'] || 'Concept Clarity',    desc: content['about_method_1_desc'] || 'Crystal-clear fundamentals through interactive, demo-driven sessions that build unshakeable foundations.' },
    { no: '02', title: content['about_method_2_title'] || 'Hands-On Labs',      desc: content['about_method_2_desc'] || 'Every session includes live coding or communication exercises — understanding is proven by doing.' },
    { no: '03', title: content['about_method_3_title'] || 'Real Projects',      desc: content['about_method_3_desc'] || 'Work on industry-standard projects that go directly into your portfolio and impress hiring managers.' },
    { no: '04', title: content['about_method_4_title'] || 'Mock Assessments',   desc: content['about_method_4_desc'] || 'Weekly tests, code reviews, and mock interviews calibrated to the standards of top IT companies.' },
    { no: '05', title: content['about_method_5_title'] || 'Career Coaching',    desc: content['about_method_5_desc'] || 'Resume crafting, LinkedIn optimization, personal branding, and company-specific interview preparation.' },
    { no: '06', title: content['about_method_6_title'] || 'Placement Drive',    desc: content['about_method_6_desc'] || 'Active referrals, networking sessions, and connections to our growing network of hiring partners.' },
  ];

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        <div className="absolute inset-0 bg-cinematic" />
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px]" style={{ background: 'var(--orb-1)' }} />
        <Particles count={35} />
        <motion.div style={{ y: heroY, opacity: heroOp }} className="relative z-10 w-full pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-6">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="label-text text-[#007AFF] mb-8">{content['about_hero_label'] || 'About Talent Shapers Orbit'}</motion.p>
            <LineReveal inView={true} delay={0.1}>
              <h1 className="hero-text max-w-3xl" style={{ color: 'var(--text-primary)' }}>
                {content['about_hero_title'] || 'The institute that'}<br /><span className="text-gradient-blue">{content['about_hero_title_highlight'] || 'shapes futures.'}</span>
              </h1>
            </LineReveal>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="mt-8 text-xl max-w-xl font-light leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
              {content['about_hero_desc'] || 'Located at Tech Zone 4, Greater Noida West — Talent Shapers Orbit bridges the gap between education and employment through world-class, hands-on IT training.'}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* STORY */}
      <section ref={storyRef} className="relative py-32">
        <div className="absolute inset-0 bg-grid-fine" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={inViewStory ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, ease: EASE_AVP }}>
              <p className="label-text text-[#007AFF] mb-6">{content['about_story_label'] || 'Our Story'}</p>
              <LineReveal inView={inViewStory} delay={0.1}>
                <h2 className="section-text mb-8 leading-[1.05]" style={{ color: 'var(--text-primary)' }}>{content['about_story_title1'] || 'Built for the'}<br />{content['about_story_title2'] || 'ambitious.'}</h2>
              </LineReveal>
              <div className="space-y-6 text-base leading-relaxed font-light" style={{ color: 'var(--text-tertiary)' }}>
                <p>{content['about_story_p1'] || 'Talent Shapers Orbit was founded with one conviction: every aspiring tech professional deserves access to world-class, practical training — regardless of their background or previous experience.'}</p>
                <p>{content['about_story_p2'] || 'We operate at the intersection of technology and human potential. Our programs go far beyond lectures and textbooks. Every student leaves with a portfolio of real projects, interview-ready skills, and direct connections to our hiring network.'}</p>
                <p>{content['about_story_p3'] || 'From computer fundamentals to advanced AI and machine learning, our curriculum is continuously updated by industry practitioners who live and breathe the technologies they teach.'}</p>
              </div>
              <div className="mt-10">
                <Link href="/courses" className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold hover:opacity-90 transition-all duration-300 hover:scale-[1.03]" style={{ background: '#007AFF' }}>
                  {content['about_story_btn'] || 'Explore Our Programs'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={inViewStory ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.2, ease: EASE_AVP }} className="relative">
              <div className="relative rounded-2xl overflow-hidden">
                <img src={resolveMediaUrl(content['about_story_img']) || "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800"} alt="Talent Shapers Orbit" className="w-full h-[500px] object-cover brightness-[0.82] contrast-[1.04] saturate-90" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-primary)/0.5, transparent)' }} />
              </div>
              <div className="absolute bottom-6 left-6 glass rounded-xl p-5">
                <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{content['about_story_stat1_num'] || '500+'}</div>
                <div className="text-sm mt-1 font-light" style={{ color: 'var(--text-tertiary)' }}>{content['about_story_stat1_desc'] || 'Careers transformed'}</div>
              </div>
              <div className="absolute top-6 right-6 glass rounded-xl p-5">
                <div className="text-3xl font-bold text-[#30D158]">{content['about_story_stat2_num'] || '100%'}</div>
                <div className="text-sm mt-1 font-light" style={{ color: 'var(--text-tertiary)' }}>{content['about_story_stat2_desc'] || 'Placement support'}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section ref={mvRef} className="relative py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-3 gap-px" style={{ background: 'var(--border-subtle)' }}>
            {[
              { label: content['about_mv_mission_label'] || 'Mission', text: content['about_mv_mission_desc'] || 'To provide practical, industry-aligned IT education that empowers every individual to build a successful tech career, regardless of background.' },
              { label: content['about_mv_vision_label'] || 'Vision',  text: content['about_mv_vision_desc'] || "To become India's most trusted IT training partner, known for producing work-ready engineers who drive technological innovation." },
              { label: content['about_mv_values_label'] || 'Values',  text: content['about_mv_values_desc'] || 'Excellence, integrity, student-first thinking, continuous innovation, and the relentless pursuit of career outcomes for every student.' },
            ].map(({ label, text }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 30 }} animate={inViewMV ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: i * 0.12, ease: EASE_AVP }}
                className="p-10 group transition-colors duration-500" style={{ background: 'var(--bg-primary)' }}>
                <p className="label-text text-[#007AFF] mb-5">{label}</p>
                <p className="text-base leading-relaxed font-light" style={{ color: 'var(--text-tertiary)' }}>{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section ref={methodRef} className="relative py-32">
        <div className="absolute inset-0 bg-grid-fine" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inViewMethod ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-20">
            <p className="label-text text-[#007AFF] mb-4">{content['about_method_label'] || 'How We Teach'}</p>
            <LineReveal inView={inViewMethod} delay={0.1}>
              <h2 className="section-text max-w-2xl" style={{ color: 'var(--text-primary)' }}>{content['about_method_title'] || 'A proven six-step method.'}</h2>
            </LineReveal>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--border-subtle)' }}>
            {methodSteps.map(({ no, title, desc }, i) => (
              <motion.div key={no} initial={{ opacity: 0, y: 40 }} animate={inViewMethod ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: i * 0.1, ease: EASE_AVP }}
                whileHover={{ scale: 1.005 }} className="p-8 group transition-colors duration-500" style={{ background: 'var(--bg-primary)' }}>
                <div className="label-text text-[#007AFF] mb-6">{no}</div>
                <h3 className="font-bold text-xl mb-3 group-hover:text-[#007AFF] transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>{title}</h3>
                <p className="leading-relaxed text-sm font-light" style={{ color: 'var(--text-tertiary)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINERS */}
      <section ref={trainersRef} className="relative py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={inViewTrainers ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="mb-20">
            <p className="label-text text-[#007AFF] mb-4">{content['about_trainers_label'] || 'The Faculty'}</p>
            <LineReveal inView={inViewTrainers} delay={0.1}>
              <h2 className="section-text max-w-xl" style={{ color: 'var(--text-primary)' }}>{content['about_trainers_title'] || "Experts who've walked the path."}</h2>
            </LineReveal>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-5">
            {displayTrainers.map(({ name, role, exp, past, cert, bio, img, color }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 40 }} animate={inViewTrainers ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: i * 0.12, ease: EASE_AVP }}
                whileHover={{ y: -2 }} className="glass rounded-2xl p-8">
                <div className="flex items-start gap-5 mb-5">
                  <div className="relative flex-shrink-0">
                    <img src={resolveMediaUrl(img)} alt={name} className="w-14 h-14 rounded-full object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 flex-shrink-0" style={{ background: color, borderColor: 'var(--bg-primary)' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>{name}</h3>
                    <div className="text-xs font-semibold mt-0.5" style={{ color }}>{role}</div>
                    <div className="text-xs mt-1 font-light" style={{ color: 'var(--text-muted)' }}>{past} · {exp}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed font-light mb-3" style={{ color: 'var(--text-tertiary)' }}>{bio}</p>
                <div className="label-text text-[10px]">{cert}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cinematic" />
        <div className="absolute inset-0 bg-grid" />
        <Particles count={22} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE_AVP }}>
            <p className="label-text text-[#007AFF] mb-8">{content['about_cta_label'] || 'Begin Your Journey'}</p>
            <h2 className="section-text mb-8" style={{ color: 'var(--text-primary)' }}>{content['about_cta_title'] || 'Ready to join the orbit?'}</h2>
            <p className="text-lg font-light mb-12 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{content['about_cta_desc'] || 'Book a free demo class and experience the TSO difference for yourself.'}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://wa.me/919560952733" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 px-10 py-4 rounded-full text-white font-semibold text-lg hover:opacity-90 transition-all duration-300 hover:scale-[1.03]" style={{ background: '#007AFF' }}>
                {content['about_cta_btn1'] || 'Book Free Demo'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link href="/courses" className="flex items-center gap-3 px-10 py-4 rounded-full glass font-semibold text-lg transition-all duration-300 hover:scale-[1.02]" style={{ color: 'var(--text-primary)' }}>
                {content['about_cta_btn2'] || 'View Courses'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
