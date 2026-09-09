'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, FileText, MessageSquare, LogOut, Users, MessageCircle, Settings, CheckSquare, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);

  const menu = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Site Content', icon: Settings, href: '/admin/content' },
    { label: 'Courses', icon: BookOpen, href: '/admin/courses' },
    { label: 'Features', icon: CheckSquare, href: '/admin/features' },
    { label: 'Blogs', icon: FileText, href: '/admin/blogs' },
    { label: 'Blog Topics', icon: FileText, href: '/admin/blog-topics' },
    { label: 'Trainers', icon: Users, href: '/admin/trainers' },
    { label: 'Testimonials', icon: MessageCircle, href: '/admin/testimonials' },
    { label: 'Messages', icon: MessageSquare, href: '/admin/contacts' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/admin/sync-vectors', { method: 'POST' });
      if (res.ok) {
        alert('AI Database successfully synced!');
      } else {
        alert('Failed to sync AI database.');
      }
    } catch (e) {
      alert('An error occurred during sync.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 border-r flex flex-col z-40" style={{ background: '#05050A', borderColor: 'rgba(255,255,255,0.08)' }}>
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#34AADC] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5"/><circle cx="8" cy="8" r="2" fill="white"/></svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-none">Admin Panel</div>
            <div className="text-[10px] font-bold text-[#007AFF] tracking-widest uppercase mt-0.5">Talent Shapers</div>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isExactDashboard = item.href === '/admin' && pathname !== '/admin';
          const finalActive = isExactDashboard ? false : isActive;

          return (
            <Link key={item.label} href={item.href} className="relative block">
              {finalActive && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 rounded-xl" style={{ background: 'rgba(0,122,255,0.1)', border: '1px solid rgba(0,122,255,0.2)' }} transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
              )}
              <div className="relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:text-white" style={{ color: finalActive ? '#007AFF' : 'rgba(255,255,255,0.45)' }}>
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <button onClick={handleSync} disabled={isSyncing} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-left transition-colors hover:bg-[rgba(0,122,255,0.1)] group disabled:opacity-50" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <RefreshCw className={`w-4 h-4 transition-colors ${isSyncing ? 'animate-spin text-[#007AFF]' : 'group-hover:text-[#007AFF]'}`} />
          <span className="text-sm font-medium transition-colors group-hover:text-white">{isSyncing ? 'Syncing...' : 'Sync AI Database'}</span>
        </button>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-left transition-colors hover:bg-white/5 group" style={{ color: 'rgba(255,255,255,0.45)' }}>
          <LogOut className="w-4 h-4 group-hover:text-[#FF2D55] transition-colors" />
          <span className="text-sm font-medium group-hover:text-white transition-colors">Logout</span>
        </button>
      </div>
    </aside>
  );
}
