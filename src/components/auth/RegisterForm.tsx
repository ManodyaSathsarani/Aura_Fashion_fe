import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass]    = useState(false);
  const [showConf, setShowConf]    = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register(formData.name, formData.email, formData.password, 'user');
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      toast.error(msg);
    }
  };

  const fieldClass =
    'w-full pl-11 pr-4 py-3 border border-ink-200 rounded-xl bg-ink-50/50 text-ink-900 placeholder-ink-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 focus:bg-white ' +
    'transition-all duration-200 text-sm';

  const labelClass = 'block text-xs font-semibold text-ink-600 uppercase tracking-wider mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name */}
      <div>
        <label className={labelClass}>Full Name</label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
          <input
            id="register-name"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className={fieldClass}
            placeholder="Your full name"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>Email Address</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
          <input
            id="register-email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className={fieldClass}
            placeholder="name@example.com"
          />
        </div>
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
            <input
              id="register-password"
              type={showPass ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`${fieldClass} pr-11`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>Confirm</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400 group-focus-within:text-violet-500 transition-colors pointer-events-none" />
            <input
              id="register-confirm-password"
              type={showConf ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${fieldClass} pr-11`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConf(!showConf)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
            >
              {showConf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        id="register-submit-btn"
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl
                   transition-all duration-200 shadow-violet-sm hover:shadow-violet-md disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
      >
        {isLoading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Creating account&hellip;</>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

export default RegisterForm;