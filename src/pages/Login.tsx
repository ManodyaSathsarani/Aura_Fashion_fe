



import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Star, Zap } from 'lucide-react';

const PERKS = [
  { icon: Zap,         label: 'Fast checkout' },
  { icon: Star,        label: 'Member deals' },
  { icon: ShieldCheck, label: 'Secure by default' },
];

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex flex-col">

      {/* Faint grid texture across the whole canvas */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #D4FF3F 1px, transparent 1px), linear-gradient(to bottom, #D4FF3F 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-7">

        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-white/50 hover:text-[#D4FF3F] transition-colors"
        >
          Back to home
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-10">
        {/* Poster-style headline */}
        <div className="text-center mb-10 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#D4FF3F] mb-4">
            // Member access
          </p>
          <h1
            className="text-[15vw] sm:text-7xl md:text-8xl font-black text-white leading-[0.95] tracking-tight"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            SIGN IN.
          </h1>
          <p className="mt-5 text-white/50 text-sm font-mono max-w-sm mx-auto">
            Orders, saved items, and member-only pricing — all unlocked.
          </p>
        </div>

        {/* Form card — offset hard-shadow, zine-sticker feel */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 bg-[#D4FF3F]" />
          <div className="relative bg-[#111111] border-2 border-[#D4FF3F] p-7 sm:p-9">
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Login_form.tsx
              </span>
              <span className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-[#D4FF3F]" />
              </span>
            </div>

            <LoginForm />

            <p className="mt-6 text-center text-xs text-white/40 font-mono">
              No account?{' '}
              <Link to="/register" className="text-[#D4FF3F] hover:underline">
                Create one →
              </Link>
            </p>
          </div>
        </div>

        {/* Perk strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
          {PERKS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3.5 py-2 border border-white/15 bg-white/[0.03] hover:border-[#D4FF3F]/50 transition-colors"
            >
              <Icon className="h-3.5 w-3.5 text-[#D4FF3F]" />
              <span className="text-xs font-mono text-white/60">{label}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 text-center pb-7 font-mono text-[11px] text-white/30">
        © {new Date().getFullYear()} EShop — Made in Sri Lanka
      </footer>
    </div>
  );
};

export default Login;