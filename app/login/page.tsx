'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loginAsAdmin } from '@/src/lib/auth';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('gsit2026*');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (username.trim() === 'admin' && password.trim() === 'gsit2026*') {
      loginAsAdmin(username.trim());
      setLoading(false);
      router.push('/projects');
    } else {
      setError('Credenciales incorrectas. Para acceso administrativo usa admin / gsit2026*');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-industrial-950 text-industrial-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-16 bg-blueprint-radar">
        <div className="w-full max-w-md rounded-2xl border border-industrial-800 bg-industrial-900/95 p-8 shadow-2xl backdrop-blur-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-radar-500/10 border border-radar-500/30 flex items-center justify-center text-radar-500 mx-auto shadow-industrial-sm">
              <ShieldCheck className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Acceso Administrativo</h1>
            <p className="text-xs text-industrial-400 font-mono">
              Global Solutions IT &middot; Plataforma de Gestión de Redes
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-industrial-400 mb-1 font-semibold uppercase">
                Usuario / Identificador
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-industrial-500" strokeWidth={1.75} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-industrial-800 bg-industrial-950 pl-9 pr-3 py-2.5 text-white placeholder-industrial-600 focus:border-radar-500 focus:outline-none"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-industrial-400 mb-1 font-semibold uppercase">
                Contraseña de Seguridad
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-industrial-500" strokeWidth={1.75} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-industrial-800 bg-industrial-950 pl-9 pr-3 py-2.5 text-white placeholder-industrial-600 focus:border-radar-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-radar-500 hover:bg-radar-400 text-industrial-950 font-bold text-xs font-mono tracking-wide transition-all shadow-industrial-sm"
              >
                <Lock className="w-4 h-4" strokeWidth={2} />
                <span>{loading ? 'Validando...' : 'Iniciar Sesión como Administrador'}</span>
              </button>
            </div>
          </form>

          <div className="p-3 rounded-lg bg-industrial-950 border border-industrial-850 text-[11px] font-mono text-industrial-400 text-center">
            Acceso Maestro para pruebas: <strong className="text-white">admin</strong> / <strong className="text-white">gsit2026*</strong>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
