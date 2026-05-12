import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; hint?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">
            {label}{props.required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'h-9 px-3 rounded-[var(--radius-md)] text-[var(--text-sm)]',
            'bg-[var(--color-surface)] border text-[var(--color-text)]',
            'placeholder:text-[var(--color-text-faint)] transition-all duration-[180ms]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]',
            error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)] hover:border-[var(--color-text-faint)]',
            className,
          ].join(' ')}
          {...props}
        />
        {error && <p className="text-[var(--text-xs)] text-[var(--color-error)]" role="alert">{error}</p>}
        {hint && !error && <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;