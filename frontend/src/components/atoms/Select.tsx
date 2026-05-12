import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; error?: string; options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, className = '', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">
            {label}{props.required && <span className="text-[var(--color-error)] ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={[
            'h-9 px-3 rounded-[var(--radius-md)] text-[var(--text-sm)]',
            'bg-[var(--color-surface)] border text-[var(--color-text)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]',
            error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)] hover:border-[var(--color-text-faint)]',
            className,
          ].join(' ')}
          {...props}
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <p className="text-[var(--text-xs)] text-[var(--color-error)]" role="alert">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;