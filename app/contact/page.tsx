'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, CheckCircle2, Send, Facebook, Instagram, Linkedin, Youtube, ArrowRight } from 'lucide-react';
import { useContent } from '@/components/ContentContext';

const EASE_AVP = [0.16, 1, 0.3, 1] as const;

function Particles({ count = 20 }: { count?: number }) {
  const pts = useRef(Array.from({ length: count }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2 + 0.5, op: Math.random() * 0.25 + 0.06, dur: Math.random() * 8 + 5, delay: Math.random() * 4 })));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.current.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full bg-blue-400" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.op }}
          animate={{ y: [0, -18, 0], opacity: [p.op, p.op * 2, p.op] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}

const courses = ['Python Programming', 'AI & Machine Learning', 'MERN Stack', 'ReactJS', 'SharePoint & Power Apps', 'Spoken English', 'Interview Preparation', 'Computer Fundamentals', 'Web Development', 'Other / Not Sure'];

function ContactForm() {
  const content = useContent();
  const [form, setForm] = useState({ name: '', phone: '', email: '', course: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus('done');
      } else {
        setStatus('idle');
        alert('Failed to send message. Please try again.');
      }
    } catch (err) {
      setStatus('idle');
      alert('Failed to send message. Please try again.');
    }
  };

  const inputClass = "w-full px-4 py-3.5 glass rounded-xl outline-none text-sm transition-colors";
  const inputStyle = { color: 'var(--text-primary)', background: 'var(--bg-glass)' };

  if (status === 'done') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-16">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(48,209,88,0.1)', border: '1px solid rgba(48,209,88,0.25)' }}>
          <CheckCircle2 className="w-8 h-8 text-[#30D158]" />
        </div>
        <h3 className="font-bold text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>{content['contact_form_success_title'] || 'Message Received'}</h3>
        <p className="max-w-xs mb-8 font-light leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{content['contact_form_success_desc'] || "We'll reach out within 24 hours. For faster response, message us on WhatsApp."}</p>
        <Link href="https://wa.me/919560952733" target="_blank" className="flex items-center gap-2 px-6 py-3 rounded-full text-[#30D158] text-sm font-medium hover:bg-[#30D158]/10 transition-colors" style={{ border: '1px solid rgba(48,209,88,0.25)' }}>
          <MessageCircle className="w-4 h-4" /> {content['contact_form_btn_wa'] || 'Chat on WhatsApp'}
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text text-[10px] block mb-2">{content['contact_form_input_name'] || 'Full Name *'}</label>
          <input type="text" name="name" required value={form.name} onChange={onChange} placeholder="Your name" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="label-text text-[10px] block mb-2">{content['contact_form_input_phone'] || 'Phone Number *'}</label>
          <input type="tel" name="phone" required value={form.phone} onChange={onChange} placeholder="+91 00000 00000" className={inputClass} style={inputStyle} />
        </div>
      </div>
      <div>
        <label className="label-text text-[10px] block mb-2">{content['contact_form_input_email'] || 'Email'}</label>
        <input type="email" name="email" value={form.email} onChange={onChange} placeholder="your@email.com" className={inputClass} style={inputStyle} />
      </div>
      <div>
        <label className="label-text text-[10px] block mb-2">{content['contact_form_input_course'] || 'Course of Interest'}</label>
        <select name="course" value={form.course} onChange={onChange} className={inputClass} style={{ ...inputStyle, appearance: 'none' }}>
          <option value="" style={{ background: 'var(--bg-secondary)' }}>Select a course...</option>
          {courses.map((c) => <option key={c} value={c} style={{ background: 'var(--bg-secondary)' }}>{c}</option>)}
        </select>
      </div>
      <div>
        <label className="label-text text-[10px] block mb-2">{content['contact_form_input_msg'] || 'Message'}</label>
        <textarea name="message" value={form.message} onChange={onChange} rows={4} placeholder="Tell us about your background, goals, or questions..." className={inputClass + ' resize-none'} style={inputStyle} />
      </div>
      <button type="submit" disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-semibold text-base hover:opacity-90 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
        style={{ background: '#007AFF' }}>
        {status === 'loading'
          ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
          : <><Send className="w-4 h-4" />{content['contact_form_btn_submit'] || 'Send Message'}</>}
      </button>
    </form>
  );
}

export default function ContactPage() {
  const content = useContent();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY  = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOp = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mainRef = useRef(null);
  const inView = useInView(mainRef, { once: true, margin: '-10%' });

  const contactDetails = [
    { icon: MapPin,  label: content['contact_info_address_label'] || 'Address', lines: [content['contact_info_address_line1'] || '2, Tech Zone 4, opposite Amrapali Dream Valley', content['contact_info_address_line2'] || 'Greater Noida, Uttar Pradesh 201318'], color: '#007AFF' },
    { icon: Phone,   label: content['contact_info_phone_label'] || 'Phone',   lines: [content['contact_info_phone_line1'] || '+91 9560 952733'], link: 'tel:+919560952733', color: '#30D158' },
    { icon: Mail,    label: content['contact_info_email_label'] || 'Email',   lines: [content['contact_info_email_line1'] || 'tsogreaternoida@gmail.com'], link: 'mailto:tsogreaternoida@gmail.com', color: '#FF9F0A' },
    { icon: Clock,   label: content['contact_info_hours_label'] || 'Hours',   lines: [content['contact_info_hours_line1'] || 'Mon–Sat: 9:00 AM – 8:00 PM', content['contact_info_hours_line2'] || 'Sunday: 10:00 AM – 4:00 PM'], color: '#34AADC' },
  ];

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[65vh] flex items-end overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
        <div className="absolute inset-0 bg-cinematic" /><div className="absolute inset-0 bg-grid" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[100px]" style={{ background: 'var(--orb-1)' }} />
        <Particles count={22} />
        <motion.div style={{ y: heroY, opacity: heroOp }} className="relative z-10 w-full pb-16 pt-36">
          <div className="max-w-6xl mx-auto px-6">
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="label-text text-[#007AFF] mb-6">{content['contact_hero_label'] || 'Get in Touch'}</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: EASE_AVP }} className="hero-text max-w-3xl" style={{ color: 'var(--text-primary)' }}>
              {content['contact_hero_title'] || 'Start your orbit'}<br /><span className="text-gradient-blue">{content['contact_hero_title_highlight'] || 'today.'}</span>
            </motion.h1>
          </div>
        </motion.div>
      </section>

      {/* Contact info bar */}
      <section style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'var(--border-subtle)' }}>
            {contactDetails.map(({ icon: Icon, label, lines, link, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="p-8 group transition-colors duration-500" style={{ background: 'var(--bg-primary)' }}>
                <div className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <p className="label-text text-[10px] mb-2">{label}</p>
                {lines.map((line, j) =>
                  link && j === 0
                    ? <Link key={j} href={link} className="block text-sm font-light hover:text-[#007AFF] transition-colors" style={{ color: 'var(--text-secondary)' }}>{line}</Link>
                    : <p key={j} className="text-sm font-light" style={{ color: 'var(--text-tertiary)' }}>{line}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main form section */}
      <section ref={mainRef} className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, ease: EASE_AVP }} className="lg:col-span-3">
              <p className="label-text text-[#007AFF] mb-6">{content['contact_form_label'] || 'Send a Message'}</p>
              <h2 className="text-3xl font-bold mb-8 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {content['contact_form_title1'] || "We'll get back to you"}<br />{content['contact_form_title2'] || 'within 24 hours.'}
              </h2>
              <ContactForm />
            </motion.div>

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 1, delay: 0.2, ease: EASE_AVP }} className="lg:col-span-2 space-y-5">
              {/* WhatsApp */}
              <div className="rounded-2xl p-6" style={{ background: 'rgba(48,209,88,0.05)', border: '1px solid rgba(48,209,88,0.15)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-[#30D158]/15 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-[#30D158]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{content['contact_sidebar_wa_title'] || 'WhatsApp — Fastest Response'}</p>
                    <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>{content['contact_sidebar_wa_desc'] || 'Usually within minutes'}</p>
                  </div>
                </div>
                <Link href="https://wa.me/919560952733" target="_blank"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-[#30D158] font-semibold text-sm hover:bg-[#30D158]/10 transition-colors"
                  style={{ border: '1px solid rgba(48,209,88,0.25)' }}>
                  <MessageCircle className="w-4 h-4" /> +91 9560 952733
                </Link>
              </div>

              {/* What to expect */}
              <div className="glass rounded-2xl p-6">
                <p className="label-text text-[10px] mb-4">{content['contact_sidebar_expect_label'] || 'What to Expect'}</p>
                <div className="space-y-3">
                  {[
                    content['contact_sidebar_expect_1'] || 'Free career counselling session', 
                    content['contact_sidebar_expect_2'] || 'Course details & fee structure', 
                    content['contact_sidebar_expect_3'] || 'Batch schedule & timings', 
                    content['contact_sidebar_expect_4'] || 'Live demo class arrangement', 
                    content['contact_sidebar_expect_5'] || 'Placement track record discussion'
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#007AFF] flex-shrink-0" />
                      <span className="text-sm font-light" style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="glass rounded-2xl p-6">
                <p className="label-text text-[10px] mb-4">{content['contact_sidebar_social_label'] || 'Follow Us'}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Facebook, label: 'Facebook', color: '#007AFF' },
                    { icon: Instagram, label: 'Instagram', color: '#FF2D55' },
                    { icon: Linkedin, label: 'LinkedIn', color: '#34AADC' },
                    { icon: Youtube, label: 'YouTube', color: '#FF3B30' },
                  ].map(({ icon: Icon, label, color }) => (
                    <Link key={label} href="#" className="flex items-center gap-2 px-3 py-2.5 glass rounded-xl text-xs transition-all duration-300 hover:scale-[1.02]" style={{ color: 'var(--text-tertiary)' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color }} />{label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden h-52 glass">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.8!2d77.4300!3d28.5950!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM1JzQyLjAiTiA3N8KwMjUnNDguMCJF!5e0!3m2!1sen!2sin!4v1699999999999!5m2!1sen!2sin"
                  width="100%" height="100%"
                  style={{ border: 0, filter: 'invert(92%) hue-rotate(180deg) brightness(0.85)' }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Talent Shapers Orbit Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
