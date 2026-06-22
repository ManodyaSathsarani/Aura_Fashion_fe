import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { CheckCircle2, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const BENEFITS = [
  'Exclusive member discounts & early access',
  'Fast & secure one-click checkout',
  'Real-time order tracking',
  'Curated wishlists & saved items',
];

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white">

      {/* ── LEFT — form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 order-2 lg:order-1">
        {/* Back + Login link */}
        <div className="flex items-center justify-between mb-8 max-w-md w-full mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-ink-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <p className="text-sm text-ink-400">
            Already a member?{' '}
            <Link to="/login" className="font-semibold text-violet-600 hover:text-violet-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h1
              className="text-4xl text-ink-950 mb-2"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 }}
            >
              Create Account
            </h1>
            <span className="block h-[2px] w-10 bg-gradient-to-r from-gold-400 to-gold-600 mb-3 rounded-full" />
            <p className="text-sm text-ink-400">
              Join thousands of discerning shoppers on EShop.
            </p>
          </div>

          <RegisterForm />

          <p className="mt-6 text-center text-xs text-ink-400">
            By creating an account, you agree to our{' '}
            <span className="underline cursor-pointer hover:text-ink-600 transition-colors">Terms</span>
            {' '}and{' '}
            <span className="underline cursor-pointer hover:text-ink-600 transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>

      {/* ── RIGHT — dark editorial panel ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-ink-950 flex-col justify-between p-12 relative overflow-hidden order-1 lg:order-2">
        {/* Decorations */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl -translate-y-1/3 -translate-x-1/4" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl translate-y-1/3 translate-x-1/4" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg" style={{ fontFamily: '"Cormorant Garamond", serif' }}>E</span>
            </div>
            <span
              className="text-2xl text-white"
              style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 500 }}
            >
              E<span className="text-violet-400">Shop</span>
            </span>
          </Link>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-violet-600/20 border border-violet-500/30 rounded-xl flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-violet-400" />
            </div>
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Member Benefits</span>
          </div>

          <h2
            className="text-4xl text-white mb-4 leading-[1.15]"
            style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 400 }}
          >
            Why join<br />
            <span className="italic text-violet-400">EShop?</span>
          </h2>
          <span className="block h-[2px] w-10 bg-gradient-to-r from-gold-400 to-gold-600 mb-8 rounded-full" />

          <ul className="space-y-4">
            {BENEFITS.map((text) => (
              <li key={text} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-violet-400 mt-0.5 shrink-0" />
                <span className="text-sm text-ink-300">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 p-5 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-violet-400" />
              <p className="text-xs font-semibold text-white uppercase tracking-wider">Secure Platform</p>
            </div>
            <p className="text-xs text-ink-500 leading-relaxed">
              Your personal information is encrypted and never shared with third parties.
            </p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-ink-600">
          &copy; {new Date().getFullYear()} EShop · Made with ♥ in Sri Lanka
        </div>
      </div>
    </div>
  );
};

export default Register;