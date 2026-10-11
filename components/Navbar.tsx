'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Folder, LogOut, LogIn, ShieldCheck } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-surface-border shadow-gsit-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-2 flex items-center justify-between">
        {/* Brand & Official Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Logo Global Solutions IT"
            className="h-11 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col justify-center">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-brand-deep leading-tight">
              Global Solutions IT
            </span>
            <span className="text-[10px] sm:text-[11px] text-brand-accent font-mono font-bold tracking-widest uppercase leading-tight">
              CONTROL OPERATIVO &amp; OBRAS
            </span>
          </div>
        </Link>

        {/* Right Navigation & Session Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Proyectos Button */}
          <Link
            href="/projects"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              pathname.startsWith('/projects')
                ? 'bg-brand-ice text-brand-deep border-brand-light font-bold shadow-sm'
                : 'bg-white hover:bg-surface-subtle text-gsitText-secondary hover:text-brand-deep border-surface-border'
            }`}
          >
            <Folder className="w-4 h-4 text-amber-500" strokeWidth={2} />
            <span>Proyectos</span>
          </Link>

          {/* Admin Session controls */}
          {isAdminUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-ice border border-brand-light text-brand-deep text-xs font-semibold shadow-sm">
                <span className="w-5 h-5 rounded-full bg-brand-deep text-white flex items-center justify-center text-[10px] font-bold">
                  AD
                </span>
                <span className="hidden sm:inline">Admin GSIT</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors flex items-center gap-1"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-deep hover:bg-brand-hover text-white text-xs font-semibold transition-colors shadow-gsit-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-brand-cyan" strokeWidth={2} />
              <span>Admin Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
