import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge = ({ children, className = '', size = 'md' }: BadgeProps) => {
  const sizes = { sm: 'px-1.5 py-0.5 text-xs', md: 'px-2 py-1 text-xs' };
  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
