'use client';

import { useEffect, useState } from 'react';
import { BookOpen, FileText, MessageSquare, Users, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ courses: 0, blogs: 0, contacts: 0, trainers: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [coursesRes, blogsRes, contactsRes, trainersRes, testimonialsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/contacts`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trainers`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, { headers })
        ]);

        const coursesData = await coursesRes.json();
        const blogsData = await blogsRes.json();
        const contactsData = await contactsRes.json();
        const trainersData = await trainersRes.json();
        const testimonialsData = await testimonialsRes.json();

        setStats({
          courses: coursesData.data?.length || 0,
          blogs: blogsData.data?.length || 0,
          contacts: contactsData.data?.length || 0,
          trainers: trainersData.data?.length || 0,
          testimonials: testimonialsData.data?.length || 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Courses', value: stats.courses, icon: BookOpen, color: '#007AFF', href: '/admin/courses' },
    { label: 'Published Blogs', value: stats.blogs, icon: FileText, color: '#FF9F0A', href: '/admin/blogs' },
    { label: 'Contact Messages', value: stats.contacts, icon: MessageSquare, color: '#30D158', href: '/admin/contacts' },
    { label: 'Expert Trainers', value: stats.trainers, icon: Users, color: '#FF2D55', href: '/admin/trainers' },
    { label: 'Testimonials', value: stats.testimonials, icon: Star, color: '#BF5AF2', href: '/admin/testimonials' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, Admin</h1>
        <p className="text-sm font-light text-white/50">Here is what's happening with Talent Shapers Orbit today.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <Link key={card.label} href={card.href}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-2xl group transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}>
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
              </div>
              <div>
                <div className="text-4xl font-black text-white tracking-tight mb-1">
                  {loading ? <span className="text-white/20 animate-pulse">...</span> : card.value}
                </div>
                <div className="text-sm font-medium text-white/40 uppercase tracking-widest">{card.label}</div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
