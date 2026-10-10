'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, HardHat, LogOut, LogIn, Database, Layers, Radio } from 'lucide-react';
import { getSession, logout } from '@/src/lib/auth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const session = getSession();
    if (session && session.role === 'admin') {
      setIsAdminUser(true);
      setUsername(session.username);
    } else {
      setIsAdminUser(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsAdminUser(false);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-industrial-900/90 backdrop-blur-md border-b border-industrial-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-industrial-850 border border-radar-500/40 flex items-center justify-center text-radar-500 shadow-industrial-sm group-hover:border-radar-500 transition-colors">
            <Radio className="w-5 h-5 text-radar-500 animate-pulse" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wider text-white">GLOBAL SOLUTIONS</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-radar-500/10 text-radar-500 font-mono font-semibold border border-radar-500/20">IT</span>
            </div>
            <p className="text-[10px] text-industrial-500 font-mono tracking-tight uppercase">Sistemas Contra Incendio &middot; NFPA 72</p>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-radar-500' : 'text-industrial-400 hover:text-white'
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/projects"
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname.startsWith('/projects') ? 'text-radar-500' : 'text-industrial-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" strokeWidth={1.75} />
            Portafolio de Proyectos
          </Link>
        </nav>

        {/* Right Actions & Auth Status */}
        <div className="flex items-center gap-3">
          {/* Supabase status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-industrial-850 border border-industrial-800 text-xs font-mono text-industrial-400">
            <Database className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.75} />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cloud DB</span>
          </div>

          {isAdminUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-radar-500/10 border border-radar-500/30 text-radar-500 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span className="font-semibold uppercase">{username || 'Admin'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md hover:bg-industrial-800 text-industrial-400 hover:text-red-400 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-industrial-850 hover:bg-industrial-800 border border-industrial-800 hover:border-radar-500/40 text-xs font-medium text-white transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-radar-500" strokeWidth={1.75} />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
