'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppFloat() {
  const pathname = usePathname();
  
  if (pathname.startsWith('/admin')) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 z-[200]"
    >
      <Link
        href="https://wa.me/919560952733"
        target="_blank"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full text-white text-sm font-semibold shadow-2xl transition-all duration-300 hover:scale-[1.06]"
        style={{ background: '#25D366', boxShadow: '0 8px 30px rgba(37,211,102,0.4)' }}
      >
        <MessageCircle className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:block">Book Free Demo</span>
      </Link>
    </motion.div>
  );
}
