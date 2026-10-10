'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loginAsAdmin } from '@/src/lib/auth';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col bg-surface-main text-gsitText-main">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-16 bg-gradient-to-b from-white to-surface-main">
        <div className="w-full max-w-md rounded-2xl border border-surface-border bg-white p-8 shadow-gsit-lg space-y-6">
          <div className="text-center space-y-3">
            <img
              src="/logo.png"
              alt="Logo Global Solutions IT"
              className="h-14 w-auto mx-auto object-contain"
            />
            <div>
              <h1 className="text-2xl font-black text-brand-deep tracking-tight">Acceso Administrativo</h1>
              <p className="text-xs text-brand-accent font-mono font-bold tracking-wider uppercase mt-0.5">
                Global Solutions IT &middot; Control Operativo
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" strokeWidth={2} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold uppercase">
                Usuario / Identificador
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gsitText-muted" strokeWidth={2} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-main pl-9 pr-3 py-2.5 text-gsitText-main placeholder-gsitText-muted focus:border-brand-primary focus:outline-none"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-gsitText-secondary mb-1 font-bold uppercase">
                Contraseña de Seguridad
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gsitText-muted" strokeWidth={2} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-main pl-9 pr-3 py-2.5 text-gsitText-main placeholder-gsitText-muted focus:border-brand-primary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-deep hover:bg-brand-hover text-white font-bold text-xs tracking-wide transition-all shadow-gsit-sm"
              >
                <Lock className="w-4 h-4 text-brand-cyan" strokeWidth={2} />
                <span>{loading ? 'Validando...' : 'Iniciar Sesión como Administrador'}</span>
              </button>
            </div>
          </form>

          <div className="p-3 rounded-xl bg-surface-subtle border border-surface-border text-[11px] font-mono text-gsitText-secondary text-center">
            Acceso Maestro para pruebas: <strong className="text-brand-deep">admin</strong> / <strong className="text-brand-deep">gsit2026*</strong>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
