import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', size = 'md', loading, children, className = '', disabled, ...props }: ButtonProps) => {
  const variants = {
    primary: 'bg-moneta-orange hover:bg-moneta-orange-dark text-white',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    ghost: 'hover:bg-white/10 text-white/70 hover:text-white',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
  };
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};
