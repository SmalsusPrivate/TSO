'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageCircle, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer({ content = {} }: { content?: Record<string, string> }) {
  const pathname = usePathname();
  
  if (pathname.startsWith('/admin')) return null;
  const links = {
    company: [
      { href: '/', label: content['footer_nav_1'] || 'Home' },
      { href: '/about', label: content['footer_nav_2'] || 'About' },
      { href: '/courses', label: content['footer_nav_3'] || 'Courses' },
      { href: '/blog', label: content['footer_nav_4'] || 'Blog' },
      { href: '/contact', label: content['footer_nav_5'] || 'Contact' },
    ],
    courses: [
      content['footer_prog_1'] || 'Python Programming', 
      content['footer_prog_2'] || 'AI & Machine Learning', 
      content['footer_prog_3'] || 'MERN Stack',
      content['footer_prog_4'] || 'ReactJS', 
      content['footer_prog_5'] || 'SharePoint & Power Apps', 
      content['footer_prog_6'] || 'Spoken English',
    ],
  };

  return (
    <footer className="relative" style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 bg-grid" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#34AADC]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none" />
                    <circle cx="8" cy="8" r="2" fill="white" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="font-semibold text-sm leading-none" style={{ color: 'var(--text-primary)' }}>Talent Shapers</div>
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#007AFF]">Orbit</div>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6 font-light" style={{ color: 'var(--text-tertiary)' }}>
              {content['footer_brand_desc'] || "Greater Noida's premier IT training institute. From fundamentals to advanced engineering — your career transformation starts here."}
            </p>
            <div className="flex gap-2">
              {[
                { icon: Facebook, color: '#007AFF' },
                { icon: Instagram, color: '#FF2D55' },
                { icon: Linkedin, color: '#34AADC' },
                { icon: Youtube, color: '#FF3B30' },
              ].map(({ icon: Icon, color }, i) => (
                <Link key={i} href="#"
                  className="w-8 h-8 glass rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="label-text text-[10px] mb-5">{content['footer_nav_heading'] || 'Navigation'}</p>
            <ul className="space-y-3">
              {links.company.map(({ href, label }) => (
                <li key={href + label}>
                  <Link href={href} className="text-sm font-light transition-colors duration-300 hover:text-[#007AFF]" style={{ color: 'var(--text-tertiary)' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <p className="label-text text-[10px] mb-5">{content['footer_prog_heading'] || 'Programs'}</p>
            <ul className="space-y-3">
              {links.courses.map((label) => (
                <li key={label}>
                  <Link href="/courses" className="text-sm font-light transition-colors duration-300 hover:text-[#007AFF]" style={{ color: 'var(--text-tertiary)' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="label-text text-[10px] mb-5">{content['footer_contact_heading'] || 'Contact'}</p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-3.5 h-3.5 text-[#007AFF] mt-0.5 flex-shrink-0" />
                <span className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                  {content['footer_address'] || '2, Tech Zone 4, opposite Amrapali Dream Valley, Greater Noida, UP 201318'}
                </span>
              </li>
              <li>
                <Link href={`tel:${(content['footer_phone'] || '+919560952733').replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm font-light transition-colors hover:text-[#007AFF]" style={{ color: 'var(--text-tertiary)' }}>
                  <Phone className="w-3.5 h-3.5 text-[#30D158] flex-shrink-0" /> {content['footer_phone'] || '+91 9560 952733'}
                </Link>
              </li>
              <li>
                <Link href={`mailto:${content['footer_email'] || 'tsogreaternoida@gmail.com'}`} className="flex items-center gap-3 text-sm font-light transition-colors hover:text-[#007AFF]" style={{ color: 'var(--text-tertiary)' }}>
                  <Mail className="w-3.5 h-3.5 text-[#FF9F0A] flex-shrink-0" /> {content['footer_email'] || 'tsogreaternoida@gmail.com'}
                </Link>
              </li>
            </ul>
            <Link
              href="https://wa.me/919560952733"
              target="_blank"
              className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[#30D158] text-sm font-medium transition-all duration-300 hover:bg-[#30D158]/10"
              style={{ border: '1px solid rgba(48,209,88,0.2)' }}
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Talent Shapers Orbit. All rights reserved.
          </p>
          <p className="text-xs font-light" style={{ color: 'var(--text-muted)' }}>
            {content['footer_address']?.split(',')[1]?.trim() || 'Tech Zone 4'}, {content['footer_address']?.split(',')[3]?.trim() || 'Greater Noida West'} · {content['footer_email'] || 'tsogreaternoida@gmail.com'}
          </p>
        </div>
      </div>
    </footer>
  );
}
