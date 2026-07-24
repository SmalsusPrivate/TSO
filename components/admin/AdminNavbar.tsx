'use client';

import { signOut, useSession } from 'next-auth/react';
import { User, LogOut } from 'lucide-react';

export default function AdminNavbar() {
  const { data: session } = useSession();

  return (
    <header className="h-20 flex items-center justify-between px-8 border-b sticky top-0 z-30 backdrop-blur-md" style={{ background: 'rgba(5,5,10,0.8)', borderColor: 'rgba(255,255,255,0.08)' }}>
      <div>
        {/* Breadcrumb area or title could go here */}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-semibold text-white">{session?.user?.name || session?.user?.email || 'Admin'}</div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Administrator</div>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)' }}>
            <User className="w-4 h-4 text-white/70" />
          </div>
        </div>
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </header>
  );
}
