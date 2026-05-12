import React from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)]',
  secondary:
    'bg-[var(--color-surface-offset)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface-dynamic)]',
  ghost:
    'bg-transparent text-[var(--color-text-muted)] hover:bg-[var(--color-surface-offset)] hover:text-[var(--color-text)]',
  danger:
    'bg-[var(--color-error)] text-[var(--color-text-inverse)] hover:bg-[var(--color-error-hover)]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-[var(--text-xs)] gap-1.5',
  md: 'h-9 px-4 text-[var(--text-sm)] gap-2',
  lg: 'h-10 px-5 text-[var(--text-sm)] gap-2',
};

export default function Button({
  variant = 'primary', size = 'md', loading = false,
  leftIcon, rightIcon, disabled, children, className = '', ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium rounded-[var(--radius-md)] select-none',
        'transition-all duration-[180ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] focus-visible:outline-offset-2',
        variantClasses[variant], sizeClasses[size],
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin shrink-0" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
