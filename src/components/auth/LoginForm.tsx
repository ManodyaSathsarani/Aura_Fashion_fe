import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginForm: React.FC = () => {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const navigate                    = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const roles = Array.isArray(currentUser.roles) ? currentUser.roles : [];
        const isDashboardUser = roles.includes('admin') || roles.includes('seller');
        navigate(isDashboardUser ? '/dashboard' : '/');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wider">
          Email Address
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) clearError(); }}
            className="w-full pl-11 pr-4 py-3.5 border border-ink-200 rounded-xl bg-ink-50/50 text-ink-900 placeholder-ink-400
                       focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white
                       transition-all duration-200 text-sm"
            placeholder="name@example.com"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-ink-600 uppercase tracking-wider">
            Password
          </label>
          <button type="button" className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">
            Forgot password?
          </button>
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
          <input
            id="login-password"
            type={showPass ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => { setPassword(e.target.value); if (error) clearError(); }}
            className="w-full pl-11 pr-11 py-3.5 border border-ink-200 rounded-xl bg-ink-50/50 text-ink-900 placeholder-ink-400
                       focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white
                       transition-all duration-200 text-sm"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
          >
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        id="login-submit-btn"
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl
                   transition-all duration-200 shadow-violet-sm hover:shadow-violet-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {isLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Signing in&hellip;</>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
};

export default LoginForm;