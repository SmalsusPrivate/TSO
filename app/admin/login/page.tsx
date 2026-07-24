'use client';

import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#030308' }}>
      {/* Background aesthetics matching public site */}
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(0,122,255,0.1)' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, rgba(0,122,255,0.2), rgba(0,122,255,0.05))', border: '1px solid rgba(0,122,255,0.2)' }}>
            <Lock className="w-5 h-5 text-[#007AFF]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-sm font-light text-white/50">Sign in to manage Talent Shapers Orbit</p>
        </div>

        <button
          onClick={() => signIn('azure-ad', { callbackUrl: '/admin' })}
          className="w-full py-3.5 rounded-xl text-white text-sm font-bold mt-4 flex items-center justify-center gap-2 transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #007AFF, #0055CC)', boxShadow: '0 6px 20px rgba(0,122,255,0.3)' }}
        >
          Sign in with Microsoft
        </button>
      </motion.div>
    </div>
  );
}
