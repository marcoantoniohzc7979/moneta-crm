import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-white/60 uppercase tracking-wide">{label}</label>}
    <input
      ref={ref}
      {...props}
      className={`bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-moneta-orange/60 focus:bg-white/8 transition-colors ${error ? 'border-red-500/50' : ''} ${className}`}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
));

Input.displayName = 'Input';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ label, error, children, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-white/60 uppercase tracking-wide">{label}</label>}
    <select
      ref={ref}
      {...props}
      className={`bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-moneta-orange/60 transition-colors [&>option]:bg-moneta-navy ${error ? 'border-red-500/50' : ''} ${className}`}
    >
      {children}
    </select>
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
));

Select.displayName = 'Select';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ label, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-medium text-white/60 uppercase tracking-wide">{label}</label>}
    <textarea
      ref={ref}
      {...props}
      className={`bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-moneta-orange/60 resize-none transition-colors ${className}`}
    />
  </div>
));

TextArea.displayName = 'TextArea';
