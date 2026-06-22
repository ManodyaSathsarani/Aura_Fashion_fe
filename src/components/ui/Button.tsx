import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const variants: Record<string, string> = {
    primary:   'bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-400 shadow-[0_2px_8px_rgba(124,58,237,0.25)] hover:shadow-[0_4px_16px_rgba(124,58,237,0.35)]',
    secondary: 'bg-ink-100 text-ink-700 hover:bg-ink-200 focus:ring-ink-300',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline:   'border border-violet-300 text-violet-700 hover:bg-violet-50 focus:ring-violet-300',
    ghost:     'text-ink-600 hover:bg-ink-100 focus:ring-ink-300',
    dark:      'bg-ink-950 text-white hover:bg-ink-800 focus:ring-ink-700',
  };

  const sizes: Record<string, string> = {
    sm:  'px-4 py-1.5 text-sm gap-1.5',
    md:  'px-6 py-2.5 text-sm gap-2',
    lg:  'px-8 py-3 text-base gap-2',
    xl:  'px-10 py-4 text-lg gap-2',
  };

  const classes = [
    base,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}

      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="h-4 w-4" />
      )}

      {children}

      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="h-4 w-4" />
      )}
    </button>
  );
};

export default Button;