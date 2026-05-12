import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; error?: string; hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">
            {label}{props.required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={4}
          className={[
            'px-3 py-2 rounded-[var(--radius-md)] text-[var(--text-sm)] resize-y min-h-[80px]',
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

Textarea.displayName = 'Textarea';
export default Textarea;