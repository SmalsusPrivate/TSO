'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useContent } from './ContentContext';

function ThemeToggle({ content }: { content: Record<string, string> }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-300"
      style={{
        background: 'var(--toggle-bg)',
        border: '1px solid var(--border-medium)',
        color: 'var(--text-secondary)',
      }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      {/* Track */}
      <div className="relative w-10 h-[22px] rounded-full flex-shrink-0" style={{ background: 'var(--border-subtle)' }}>
        {/* Knob */}
        <motion.div
          className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
          style={{ background: 'var(--text-primary)' }}
          animate={{ x: isDark ? 0 : 18 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {isDark ? (
            <Moon className="w-2.5 h-2.5" style={{ color: 'var(--bg-primary)' }} />
          ) : (
            <Sun className="w-2.5 h-2.5" style={{ color: 'var(--bg-primary)' }} />
          )}
        </motion.div>
      </div>

      {/* Label */}
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="hidden sm:block text-[11px] font-medium"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {isDark ? (content['nav_theme_dark'] || 'Dark') : (content['nav_theme_light'] || 'Light')}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const content = useContent();

  const dynamicNavLinks = [
    { href: '/', label: content['nav_home'] || 'Home' },
    { href: '/about', label: content['nav_about'] || 'About' },
    { href: '/courses', label: content['nav_courses'] || 'Courses' },
    { href: '/blog', label: content['nav_blog'] || 'Blog' },
    { href: '/contact', label: content['nav_contact'] || 'Contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? `1px solid var(--nav-border)` : '1px solid transparent',
          paddingTop: scrolled ? '10px' : '20px',
          paddingBottom: scrolled ? '10px' : '20px',
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-8 h-8 flex-shrink-0">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#34AADC]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none" />
                  <circle cx="8" cy="8" r="2" fill="white" />
                </svg>
              </div>
            </div>
            <div className="hidden sm:block leading-none">
              <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{content['nav_logo_title'] || 'Talent Shapers'}</div>
              <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#007AFF]">{content['nav_logo_subtitle'] || 'Orbit'}</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {dynamicNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-[13px] font-medium rounded-lg transition-colors duration-300"
                style={{ color: pathname === link.href ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
              >
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)' }}
                    transition={{ type: 'spring', bounce: 0.12, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 hover:opacity-80 transition-opacity">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <ThemeToggle content={content} />
            <a
              href="https://api.whatsapp.com/send/?phone=919560952733&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center px-5 py-2 rounded-full text-white text-[13px] font-semibold transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
              style={{ background: '#007AFF' }}
            >
              {content['nav_demo_btn'] || 'Free Demo'}
            </a>
            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[68px] z-[99] rounded-2xl p-4 md:hidden"
            style={{
              background: 'var(--nav-bg)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid var(--border-medium)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
          >
            <div className="flex flex-col gap-1">
              {dynamicNavLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className="block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      color: pathname === link.href ? '#007AFF' : 'var(--text-secondary)',
                      background: pathname === link.href ? 'rgba(0,122,255,0.08)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="h-px my-2" style={{ background: 'var(--border-subtle)' }} />
              <a
                href="https://api.whatsapp.com/send/?phone=919560952733&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-3 rounded-xl text-white text-sm font-semibold"
                style={{ background: '#007AFF' }}
              >
                {content['nav_demo_btn_mobile'] || 'Book Free Demo Class'}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
